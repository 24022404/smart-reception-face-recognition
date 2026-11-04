"""
app.py — Server nhận diện khuôn mặt
  Luồng 1: đọc camera liên tục
  Bám mặt (tìm VỊ TRÍ mặt trên mọi khung hình):
     - bình thường: trình duyệt làm (MediaPipe, gửi vị trí lên qua POST /api/mat)
     - nếu trình duyệt không gửi: Luồng 2 làm thay (YuNet, hoặc dự phòng)
  Luồng 3: nhận diện — tìm TÊN cho từng mặt đang thấy (retinaface + ArcFace, chậm hơn)
  Flask  : trả video + kết quả cho trang web

Cách chạy:  python app.py   rồi mở http://localhost:5000

API:
  GET    /video_feed          video từ camera (thêm ?khung=1 để vẽ khung quanh mặt)
  GET    /api/nhan_dien       ai đang đứng trước camera
  POST   /api/mat             trình duyệt gửi vị trí các mặt nó thấy, nhận lại tên
  GET    /api/trang_thai      thông số hệ thống (model, ngưỡng, thời gian xử lý...)
  GET    /api/ban_do          vị trí người đã đăng ký trên bản đồ khuôn mặt
  Đăng nhập (chỉ 1 tài khoản quản trị; lần đầu chạy thì đặt mật khẩu):
  GET    /api/phien           đã đặt mật khẩu chưa? đang đăng nhập không?
  POST   /api/dat_mat_khau    {"mat_khau": "..."}  chỉ dùng được 1 lần, lúc chưa có mật khẩu
  POST   /api/dang_nhap       {"mat_khau": "..."}
  POST   /api/dang_xuat
  GET    /api/ngon_ngu        ngôn ngữ đang dùng ('en' hoặc 'vi') — ai cũng xem được (màn hình chào cần)
  POST   /api/ngon_ngu        {"ngon_ngu": "vi"}  đổi ngôn ngữ (phải đăng nhập)
  Các API dưới đây (và trang admin.html) phải đăng nhập mới dùng được:
  GET    /api/nguoi           danh sách người (hồ sơ + mã từng ảnh)
  POST   /api/nguoi           tạo người mới + chụp ảnh đầu tiên từ camera
                              {"loai": "nhan_vien"|"khach", "ho_ten", "ma_nv", "danh_xung", "phong_ban",
                               "chuc_vu", "don_vi", "gap_ai", "het_han", "trang_thai", "ghi_chu", "dong_y": true}
  GET    /api/nguoi/<id>      hồ sơ 1 người
  PUT    /api/nguoi/<id>      sửa hồ sơ
  DELETE /api/nguoi/<id>      xóa 1 người (cả ảnh)
  POST   /api/nguoi/<id>/anh  chụp thêm 1 ảnh từ camera cho người đó
  GET    /api/anh/<mã>        xem 1 ảnh đã đăng ký
  DELETE /api/anh/<mã>        xóa 1 ảnh
  GET    /api/nhat_ky         nhật ký ra vào  ?ngay=2026-11-04 &loai=nhan_vien|khach|la &nguoi=<id> &gioi_han=200
  GET    /api/nhat_ky.csv     như trên, tải về file CSV (mở bằng Excel)
  GET    /api/tong_quan       số liệu hôm nay: nhân viên đã đến / chưa đến, khách, người lạ, lượt theo giờ
  GET    /api/anh_la/<mã>     ảnh chụp người lạ
  DELETE /api/anh_la/<mã>     xóa 1 ảnh người lạ
  GET    /api/cai_dat         cài đặt của quản trị viên (số ngày giữ ảnh người lạ, lời chào...)
  PUT    /api/cai_dat         {"giu_anh_la_ngay": 7} hoặc {"loi_chao": {"nhan_vien": "{buoi}", ...}}
  POST   /api/doi_mat_khau    {"cu": "...", "moi": "..."}  (các trình duyệt khác bị đăng xuất)
  GET    /api/man_chao        ngôn ngữ + lời chào cho màn hình chào (ai cũng xem được)
  (POST /api/nguoi có thêm "tu_anh_la": "<mã ảnh người lạ>" -> dùng ảnh đó thay vì chụp từ camera)
"""
import os, time, threading, mimetypes, itertools, traceback, json, secrets
from functools import wraps
import cv2

# Windows đôi khi báo sai loại file .css/.js -> trình duyệt từ chối dùng. Khai báo cứng cho chắc.
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('application/javascript', '.js')
from flask import Flask, Response, jsonify, request, send_from_directory, send_file, abort, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import face_core
from face_core import DanhBa, tach_mat, tim_mat_nhanh

THU_MUC = os.path.dirname(os.path.abspath(__file__))     # thư mục chứa app.py

CAMERA_SOURCE = os.environ.get('CAMERA_SOURCE', '0')     # '0' = webcam máy; hoặc URL như dự án cũ
FILE_DU_LIEU  = os.environ.get('FILE_DU_LIEU', os.path.join(THU_MUC, 'du_lieu.db'))     # cơ sở dữ liệu SQLite
FILE_DANH_BA  = os.environ.get('FILE_DANH_BA', os.path.join(THU_MUC, 'danh_ba.npz'))   # file cũ (tự chuyển sang)
FRONTEND_DIR  = os.environ.get('FRONTEND_DIR', os.path.join(THU_MUC, 'frontend'))
THU_MUC_ANH   = os.environ.get('THU_MUC_ANH', os.path.join(THU_MUC, 'anh_dang_ky'))   # ảnh mặt đã đăng ký
THU_MUC_ANH_LA = os.environ.get('THU_MUC_ANH_LA', os.path.join(THU_MUC, 'anh_nguoi_la'))  # ảnh chụp người lạ
FILE_CAI_DAT  = os.environ.get('FILE_CAI_DAT', os.path.join(THU_MUC, 'cai_dat.json'))    # mật khẩu (đã mã hóa)
THU_MUC_THU_VIEN = os.environ.get('THU_MUC_THU_VIEN', os.path.join(THU_MUC, 'thu_vien'))  # MediaPipe + phông chữ có sẵn


# ---------- Cài đặt: mật khẩu quản trị + khóa ký phiên đăng nhập ----------
def doc_cai_dat():
    if os.path.exists(FILE_CAI_DAT):
        with open(FILE_CAI_DAT, encoding='utf-8') as f:
            return json.load(f)
    return {}

def luu_cai_dat(cd):
    with open(FILE_CAI_DAT, 'w', encoding='utf-8') as f:
        json.dump(cd, f, ensure_ascii=False, indent=2)

cai_dat = doc_cai_dat()
if 'khoa_phien' not in cai_dat:                 # khóa bí mật để ký cookie đăng nhập, tạo 1 lần rồi giữ
    cai_dat['khoa_phien'] = secrets.token_hex(32)
    luu_cai_dat(cai_dat)

# ---------- Thông báo của server bằng 2 thứ tiếng ----------
TB = {
    'can_dang_nhap':   {'en': 'Please sign in',               'vi': 'Vui lòng đăng nhập'},
    'da_co_mat_khau':  {'en': 'A password is already set',    'vi': 'Đã có mật khẩu rồi'},
    'mat_khau_ngan':   {'en': 'Use at least 6 characters',    'vi': 'Mật khẩu cần ít nhất 6 ký tự'},
    'da_dat_mat_khau': {'en': 'Password set',                 'vi': 'Đã đặt mật khẩu'},
    'sai_mat_khau':    {'en': 'Wrong password',               'vi': 'Sai mật khẩu'},
    'da_dang_nhap':    {'en': 'Signed in',                    'vi': 'Đã đăng nhập'},
    'da_dang_xuat':    {'en': 'Signed out',                   'vi': 'Đã đăng xuất'},
    'khong_thay_anh':  {'en': 'Photo not found',              'vi': 'Không tìm thấy ảnh'},
    'da_xoa_anh':      {'en': 'Removed 1 photo of {ten}',     'vi': 'Đã xóa 1 ảnh của {ten}'},
    'het_anh':         {'en': ' — {ten} has no photos left',  'vi': ' — {ten} không còn ảnh nào'},
    'thieu_ten':       {'en': 'Name is required',             'vi': 'Chưa nhập tên'},
    'chua_co_hinh':    {'en': 'No camera image yet',          'vi': 'Chưa có hình từ camera'},
    'sai_so_mat':      {'en': 'Found {n} faces, need exactly 1', 'vi': 'Thấy {n} khuôn mặt, cần đúng 1'},
    'da_them_anh':     {'en': 'Added 1 photo for {ten} ({n} in total)', 'vi': 'Đã thêm 1 ảnh cho {ten} (tổng {n} ảnh)'},
    'da_xoa_nguoi':    {'en': 'Removed {ten}',                'vi': 'Đã xóa {ten}'},
    'da_tao':          {'en': '{ten} registered with the first photo', 'vi': 'Đã đăng ký {ten} kèm ảnh đầu tiên'},
    'da_luu_ho_so':    {'en': 'Profile saved',                'vi': 'Đã lưu hồ sơ'},
    'sai_loai':        {'en': 'Choose Employee or Guest',     'vi': 'Hãy chọn Nhân viên hoặc Khách'},
    'thieu_ma_nv':     {'en': 'Employee ID is required',      'vi': 'Chưa nhập mã nhân viên'},
    'trung_ma_nv':     {'en': 'This employee ID is already used', 'vi': 'Mã nhân viên này đã có người dùng'},
    'sai_ngay':        {'en': 'Invalid date',                 'vi': 'Ngày không hợp lệ'},
    'chua_dong_y':     {'en': 'Tick the consent box first',   'vi': 'Hãy đánh dấu ô đồng ý trước'},
    'khong_thay_nguoi': {'en': 'Person not found',            'vi': 'Không tìm thấy người này'},
    'da_xoa_anh_la':   {'en': 'Photo deleted',                'vi': 'Đã xóa ảnh'},
    'da_luu_cai_dat':  {'en': 'Settings saved',               'vi': 'Đã lưu cài đặt'},
    'sai_gia_tri':     {'en': 'Invalid value',                'vi': 'Giá trị không hợp lệ'},
    'sai_mat_khau_cu': {'en': 'Current password is wrong',    'vi': 'Mật khẩu hiện tại không đúng'},
    'da_doi_mat_khau': {'en': 'Password changed. Other browsers have been signed out.',
                        'vi': 'Đã đổi mật khẩu. Các trình duyệt khác đã bị đăng xuất.'},
    'sai_ngon_ngu':    {'en': 'Unknown language',             'vi': 'Ngôn ngữ không hợp lệ'},
}

def tb(khoa, **thay):
    """Thông báo theo ngôn ngữ đang chọn trong cài đặt."""
    return TB[khoa][cai_dat.get('ngon_ngu', 'en')].format(**thay)


app = Flask(__name__)
app.secret_key = cai_dat['khoa_phien']
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
CORS(app)


def da_dang_nhap():
    return session.get('quan_tri') is True

def can_dang_nhap(ham):
    """Gắn lên API nào chỉ quản trị viên được dùng."""
    @wraps(ham)
    def boc(*args, **kwargs):
        if not da_dang_nhap():
            return jsonify({'ok': False, 'thong_bao': tb('can_dang_nhap')}), 401
        return ham(*args, **kwargs)
    return boc

danh_ba = DanhBa(FILE_DU_LIEU, THU_MUC_ANH, file_cu=FILE_DANH_BA, thu_muc_anh_la=THU_MUC_ANH_LA)
khoa = threading.Lock()      # tránh 2 luồng dùng danh bạ cùng lúc

khung_moi = None             # khung hình mới nhất từ camera
lan_khung_cuoi = 0           # lúc nhận khung hình gần nhất (để biết camera còn chạy không)
mat_dang_thay = []           # mặt đang thấy, cập nhật mỗi khung hình: [{'id', 'box', 'diem'}, ...]
thong_tin = {}               # id mặt -> kết quả nhận diện (tên, khoảng cách...). Chưa có = đang nhận diện
tim_mat_ms = 0               # thời gian tìm vị trí mặt trong 1 khung hình (mili giây)
nhan_dien_ms = 0             # thời gian nhận diện 1 khuôn mặt (mili giây)
dem_id = itertools.count(1)  # cấp số id cho mỗi khuôn mặt mới xuất hiện
lan_cuoi_thay = {}           # id mặt -> lần cuối còn thấy (để quên mặt đã đi hẳn)
khoa_mat = threading.Lock()
trinh_duyet_luc = 0          # lần cuối trình duyệt gửi vị trí mặt lên
LAN_KIEM_TRA_LAI = 3         # mặt đã có tên: 3 giây mới nhận diện lại một lần (cho máy đỡ bận)
CACH_GHI_LAI = 10 * 60       # cùng 1 người: 10 phút mới ghi nhật ký lại 1 lần (như máy chấm công)
CACH_GHI_LA  = 30            # người lạ: tối đa 1 lần ghi mỗi 30 giây
GIU_ANH_LA_CHON = (0, 1, 7, 30, 90)
# Lời chào mặc định trên màn hình chào. {buoi} sẽ thành "Chào buổi sáng / chiều / tối" (hoặc Good morning...)
LOI_CHAO_MAC_DINH = {
    'vi': {'nhan_vien': '{buoi}', 'khach': '{buoi}', 'la_tieu_de': 'Xin chào', 'la_dong': 'Bạn chưa có trong danh sách'},
    'en': {'nhan_vien': '{buoi}', 'khach': '{buoi}', 'la_tieu_de': 'Hello', 'la_dong': 'You are not registered yet'},
}   # các lựa chọn "giữ ảnh người lạ bao nhiêu ngày" (0 = không lưu ảnh)
LUC_BAT_DAU = time.time()    # để tính hệ thống đã chạy bao lâu


def doc_camera():
    global khung_moi, lan_khung_cuoi
    nguon = int(CAMERA_SOURCE) if CAMERA_SOURCE.isdigit() else CAMERA_SOURCE
    while True:
        cam = cv2.VideoCapture(nguon)
        while cam.isOpened():
            ok, frame = cam.read()
            if not ok:
                break
            khung_moi = frame
            lan_khung_cuoi = time.time()
        print('Mất kết nối camera, thử lại sau 2 giây...')
        cam.release()
        time.sleep(2)


def gan_nhat(box, ds):
    """Mặt trong ds có tâm gần tâm `box` nhất (và đủ gần) -> coi là cùng một người."""
    x, y, w, h = box
    tot, kc_tot = None, max(w, h) * 0.8
    for m in ds:
        mx, my, mw, mh = m['box']
        kc = (((x + w / 2) - (mx + mw / 2)) ** 2 + ((y + h / 2) - (my + mh / 2)) ** 2) ** 0.5
        if kc < kc_tot:
            tot, kc_tot = m, kc
    return tot


def dat_mat_dang_thay(moi):
    """Cập nhật danh sách mặt đang thấy; quên kết quả của mặt đã biến mất quá 2 giây."""
    global mat_dang_thay
    with khoa_mat:
        bay_gio = time.time()
        mat_dang_thay = moi
        for m in moi:
            lan_cuoi_thay[m['id']] = bay_gio
        for k in [k for k, t in lan_cuoi_thay.items() if bay_gio - t > 2]:
            lan_cuoi_thay.pop(k, None)
            thong_tin.pop(k, None)


def trinh_duyet_dang_bam():
    return time.time() - trinh_duyet_luc < 1


def bam_mat_lien_tuc():
    """Luồng 2: tìm vị trí mặt trên từng khung hình khi trình duyệt KHÔNG làm việc này
    (trang chào chưa mở, hoặc máy không chạy được MediaPipe). Mặt ở gần vị trí cũ giữ nguyên id."""
    global tim_mat_ms
    vua_mat = []             # mặt vừa biến mất: giữ 1 giây, phòng khi quay đầu/chớp làm mất vài khung
    while True:
        if khung_moi is None or trinh_duyet_dang_bam():
            time.sleep(0.2); continue
        t0 = time.time()
        hop = tim_mat_nhanh(khung_moi)
        tim_mat_ms = round((time.time() - t0) * 1000)

        bay_gio = time.time()
        cu = mat_dang_thay + vua_mat
        moi = []
        for h in hop:
            m = gan_nhat(h['box'], cu)
            if m:
                cu.remove(m)
                moi.append({'id': m['id'], **h})
            else:
                moi.append({'id': next(dem_id), **h})          # mặt mới -> chờ luồng 3 nhận diện
        ids = {m['id'] for m in moi}
        vua_mat = [m for m in vua_mat if m['id'] not in ids and bay_gio - m['luc_mat'] < 1] + \
                  [dict(m, luc_mat=bay_gio) for m in mat_dang_thay if m['id'] not in ids]
        dat_mat_dang_thay(moi)
        time.sleep(0.01)


def nhan_dien_lien_tuc():
    """Luồng 3: lần lượt nhận diện từng mặt đang thấy. Mặt chưa có tên được làm trước.
    Chỉ cắt vùng quanh mặt để retinaface chạy nhanh hơn, không xử lý cả khung hình."""
    global nhan_dien_ms
    lan_thu = {}                                        # id -> lần nhận diện gần nhất
    nk = {'da_ghi_quen': set(), 'da_ghi_la': set(), 'dem_la': {}, 'lan_ghi_la': 0}   # trạng thái ghi nhật ký
    while True:
        frame, mats = khung_moi, list(mat_dang_thay)
        if frame is None or not mats:
            time.sleep(0.05); continue
        m = min(mats, key=lambda m: (m['id'] in thong_tin, lan_thu.get(m['id'], 0)))
        if m['id'] in thong_tin and time.time() - lan_thu.get(m['id'], 0) < LAN_KIEM_TRA_LAI:
            time.sleep(0.05); continue                  # ai cũng đã có tên và vừa kiểm tra xong -> nghỉ
        lan_thu[m['id']] = time.time()
        for k in [k for k in lan_thu if k not in lan_cuoi_thay]:
            lan_thu.pop(k, None)

        t0 = time.time()
        mat = m.get('mat')                       # bám mặt bằng retinaface (dự phòng): đã có sẵn ảnh mặt
        if mat is None:
            x, y, w, h = m['box']
            H, W = frame.shape[:2]
            x1, y1 = max(0, int(x - w * 0.5)), max(0, int(y - h * 0.5))      # nới rộng mỗi bên nửa khuôn mặt
            x2, y2 = min(W, int(x + w * 1.5)), min(H, int(y + h * 1.5))
            trong_vung = tach_mat(frame[y1:y2, x1:x2])
            if trong_vung:
                tam_x, tam_y = (x2 - x1) / 2, (y2 - y1) / 2                   # lấy mặt gần giữa vùng cắt nhất
                mat = min(trong_vung, key=lambda f: (f['box'][0] + f['box'][2] / 2 - tam_x) ** 2 +
                                                    (f['box'][1] + f['box'][3] / 2 - tam_y) ** 2)
        if mat is not None:
            with khoa:
                pt = danh_ba.phan_tich(mat['face'])
            n = pt['nguoi']                          # None = người lạ
            thong_tin[m['id']] = {
                'ten': n['ho_ten'] if n else None,
                'id_nguoi': n['id'] if n else None,
                'loai': n['loai'] if n else None,
                'danh_xung': n['danh_xung'] if n else '',
                'phong_ban': n['phong_ban'] if n else '',
                'don_vi': n['don_vi'] if n else '',
                'khoang_cach': round(pt['khoang_cach'], 3),
                'ung_vien': pt['ung_vien'],
                'xy': pt['xy'],
                'chat_luong': face_core.chat_luong(mat['face'], mat['diem']),
                'anh': face_core.anh_nho(mat['face']),
            }
            if m['id'] not in lan_cuoi_thay:          # mặt đã đi mất trong lúc đang nhận diện
                thong_tin.pop(m['id'], None)
            else:
                ghi_nhat_ky(nk, m['id'], n, pt['khoang_cach'], mat['face'])
        nhan_dien_ms = round((time.time() - t0) * 1000)


def ghi_nhat_ky(nk, id_mat, n, khoang_cach, face):
    """Quyết định có ghi nhật ký không.
    - Người quen: ghi 1 lần cho mỗi lần xuất hiện, và cách lần trước ít nhất CACH_GHI_LAI.
    - Người lạ: phải là người lạ ở 2 lần nhận diện liên tiếp (tránh ghi nhầm lúc mới quay mặt vào),
      mỗi lần xuất hiện ghi 1 lần, kèm ảnh chụp."""
    for k in ('da_ghi_quen', 'da_ghi_la'):                      # quên các mặt đã đi khỏi
        nk[k] &= set(lan_cuoi_thay)
    nk['dem_la'] = {k: v for k, v in nk['dem_la'].items() if k in lan_cuoi_thay}
    if n:
        nk['dem_la'].pop(id_mat, None)
        if id_mat not in nk['da_ghi_quen']:
            nk['da_ghi_quen'].add(id_mat)
            danh_ba.ghi_su_kien('chao', n, khoang_cach, cach_toi_thieu=CACH_GHI_LAI)
        return
    nk['dem_la'][id_mat] = nk['dem_la'].get(id_mat, 0) + 1
    if nk['dem_la'][id_mat] >= 2 and id_mat not in nk['da_ghi_la'] and time.time() - nk['lan_ghi_la'] >= CACH_GHI_LA:
        nk['da_ghi_la'].add(id_mat)
        nk['lan_ghi_la'] = time.time()
        danh_ba.ghi_su_kien('la', None, khoang_cach, face=face, luu_anh=giu_anh_la_ngay() > 0)


def giu_anh_la_ngay():
    return cai_dat.get('giu_anh_la_ngay', 7)


def don_dep_dinh_ky():
    """Luồng 4: mỗi giờ xóa ảnh người lạ đã quá hạn (theo Settings > Quyền riêng tư)."""
    while True:
        so = danh_ba.don_anh_la(giu_anh_la_ngay())
        if so:
            print(f'Đã xóa {so} ảnh người lạ quá {giu_anh_la_ngay()} ngày')
        time.sleep(3600)


def chay_khong_dung(ham):
    """Chạy `ham` trong luồng riêng. Nếu lỗi: in lỗi ra cửa sổ lệnh rồi chạy lại sau 2 giây
    (trước đây lỗi làm luồng chết im lặng -> trang web không thấy mặt mà không biết vì sao)."""
    def chay():
        while True:
            try:
                ham()
            except Exception:
                print(f'\n[LỖI trong {ham.__name__}] -- thử lại sau 2 giây')
                traceback.print_exc()
                time.sleep(2)
    threading.Thread(target=chay, daemon=True).start()


def ket_qua_hien_tai():
    """Vị trí mới nhất của từng mặt + tên (nếu đã nhận diện xong)."""
    kq = []
    for m in mat_dang_thay:
        r = {'id': m['id'], 'box': [int(v) for v in m['box']], 'diem': m['diem']}
        tt = thong_tin.get(m['id'])
        r.update(tt if tt else {'ten': None, 'dang_cho': True})
        kq.append(r)
    return kq


def video(ve_khung):
    while True:
        if khung_moi is None:
            time.sleep(0.1); continue
        frame = khung_moi.copy()
        for r in (ket_qua_hien_tai() if ve_khung else []):
            x, y, w, h = r['box']
            mau = (150, 150, 150) if r.get('dang_cho') else (0, 200, 0) if r['ten'] else (0, 0, 255)
            cv2.rectangle(frame, (x, y), (x + w, y + h), mau, 2)
        _, jpg = cv2.imencode('.jpg', frame)
        yield b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + jpg.tobytes() + b'\r\n'
        time.sleep(0.04)     # khoảng 25 hình/giây


LOAI_FILE = {'.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript'}

def gui_file_giao_dien(ten_file):
    """Ghi rõ loại file (không hỏi Windows) và cấm trình duyệt dùng bản cũ đã lưu."""
    loai = LOAI_FILE.get(os.path.splitext(ten_file)[1].lower())
    r = send_from_directory(FRONTEND_DIR, ten_file, mimetype=loai, max_age=0,
                            conditional=False, etag=False)    # luôn gửi file mới, không bao giờ trả 304
    r.headers['Cache-Control'] = 'no-store'
    return r

LOAI_THU_VIEN = {'.mjs': 'application/javascript', '.js': 'application/javascript',
                 '.wasm': 'application/wasm', '.css': 'text/css', '.woff2': 'font/woff2',
                 '.tflite': 'application/octet-stream', '.txt': 'text/plain; charset=utf-8'}

@app.route('/thu_vien/<path:duong_dan>')
def file_thu_vien(duong_dan):
    """MediaPipe, model tìm mặt, phông chữ: có sẵn trong máy nên chạy được khi mất mạng."""
    loai = LOAI_THU_VIEN.get(os.path.splitext(duong_dan)[1].lower())
    if not loai:
        abort(404)
    r = send_from_directory(THU_MUC_THU_VIEN, duong_dan, mimetype=loai, max_age=7 * 24 * 3600)
    return r

@app.route('/')
def trang_chu():
    return gui_file_giao_dien('index.html')

@app.route('/<ten_file>')
def file_giao_dien(ten_file):
    """index.html, admin.html, login.html, style.css, script.js"""
    if ten_file == 'admin.html' and not da_dang_nhap():
        return redirect('/login.html')                  # chưa đăng nhập -> sang trang đăng nhập
    if ten_file == 'login.html' and da_dang_nhap():
        return redirect('/admin.html')
    return gui_file_giao_dien(ten_file)


# ---------- Đăng nhập ----------
@app.route('/api/phien')
def api_phien():
    return jsonify({'da_dat_mat_khau': 'mat_khau' in cai_dat, 'da_dang_nhap': da_dang_nhap()})


@app.route('/api/dat_mat_khau', methods=['POST'])
def api_dat_mat_khau():
    """Lần đầu chạy: đặt mật khẩu quản trị. Đã có mật khẩu rồi thì không cho đặt lại ở đây."""
    if 'mat_khau' in cai_dat:
        return jsonify({'ok': False, 'thong_bao': tb('da_co_mat_khau')}), 400
    mk = (request.get_json(silent=True) or {}).get('mat_khau', '')
    if len(mk) < 6:
        return jsonify({'ok': False, 'thong_bao': tb('mat_khau_ngan')}), 400
    cai_dat['mat_khau'] = generate_password_hash(mk)   # chỉ lưu bản mã hóa, không lưu mật khẩu thật
    luu_cai_dat(cai_dat)
    session['quan_tri'] = True
    return jsonify({'ok': True, 'thong_bao': tb('da_dat_mat_khau')})


@app.route('/api/dang_nhap', methods=['POST'])
def api_dang_nhap():
    mk = (request.get_json(silent=True) or {}).get('mat_khau', '')
    if 'mat_khau' not in cai_dat or not check_password_hash(cai_dat['mat_khau'], mk):
        time.sleep(1)                                   # chậm lại 1 giây để khó đoán mò mật khẩu
        return jsonify({'ok': False, 'thong_bao': tb('sai_mat_khau')}), 401
    session['quan_tri'] = True
    return jsonify({'ok': True, 'thong_bao': tb('da_dang_nhap')})


@app.route('/api/dang_xuat', methods=['POST'])
def api_dang_xuat():
    session.clear()
    return jsonify({'ok': True, 'thong_bao': tb('da_dang_xuat')})


@app.route('/api/ngon_ngu')
def api_xem_ngon_ngu():
    return jsonify({'ngon_ngu': cai_dat.get('ngon_ngu', 'en')})


@app.route('/api/ngon_ngu', methods=['POST'])
@can_dang_nhap
def api_doi_ngon_ngu():
    nn = (request.get_json(silent=True) or {}).get('ngon_ngu')
    if nn not in ('en', 'vi'):
        return jsonify({'ok': False, 'thong_bao': tb('sai_ngon_ngu')}), 400
    cai_dat['ngon_ngu'] = nn
    luu_cai_dat(cai_dat)
    return jsonify({'ok': True, 'ngon_ngu': nn})


@app.route('/video_feed')
def video_feed():
    ve_khung = request.args.get('khung') == '1'      # /video_feed?khung=1 để vẽ khung quanh mặt
    return Response(video(ve_khung), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/api/nhan_dien')
def api_nhan_dien():
    return jsonify(ket_qua_hien_tai())


@app.route('/api/mat', methods=['POST'])
def api_mat():
    """Trình duyệt gửi: {"mat": [{"id": 3, "box": [x, y, w, h], "diem": [[x, y], ...]}], "ms": 12}
    Trả lại tên (nếu đã nhận diện xong) cho từng mặt."""
    global trinh_duyet_luc, tim_mat_ms
    du_lieu = request.get_json(silent=True) or {}
    moi = []
    for m in du_lieu.get('mat', []):
        x, y, w, h = [int(v) for v in m['box']]
        moi.append({'id': f"b{m['id']}", 'box': (x, y, w, h), 'diem': m.get('diem', [])})
    trinh_duyet_luc = time.time()
    tim_mat_ms = round(du_lieu.get('ms', 0))
    dat_mat_dang_thay(moi)
    return jsonify(ket_qua_hien_tai())


def ten_cach_bam_mat():
    if trinh_duyet_dang_bam():
        return f'mediapipe + {face_core.DETECTOR}'
    if face_core.BAM_MAT == 'retinaface':
        return 'retinaface (fallback)'
    if face_core.BAM_MAT == '?':
        return 'starting…'
    return f'{face_core.BAM_MAT} + {face_core.DETECTOR}'


@app.route('/api/trang_thai')
def api_trang_thai():
    return jsonify({
        'model': face_core.MODEL,
        'detector': ten_cach_bam_mat(),
        'nguong': face_core.NGUONG,
        'tim_mat_ms': tim_mat_ms,
        'nhan_dien_ms': nhan_dien_ms,
        'xu_ly_ms': tim_mat_ms + nhan_dien_ms,
        'so_nguoi': danh_ba.so_nguoi(),
        'so_anh': danh_ba.so_anh(),
        'camera_chay': time.time() - lan_khung_cuoi < 2,
        'chay_giay': round(time.time() - LUC_BAT_DAU),
    })


@app.route('/api/ban_do')
def api_ban_do():
    """Vị trí các ảnh đã đăng ký trên bản đồ khuôn mặt."""
    with khoa:
        return jsonify(danh_ba.diem_ban_do())


def tra_loi_loi(ma_loi, so_mat=None, ma_http=400):
    thong_bao = tb('sai_so_mat', n=so_mat) if ma_loi == 'sai_so_mat' else tb(ma_loi)
    return jsonify({'ok': False, 'loi': ma_loi, 'thong_bao': thong_bao}), ma_http


@app.route('/api/nguoi')
@can_dang_nhap
def api_ds_nguoi():
    with khoa:
        return jsonify(danh_ba.danh_sach())


@app.route('/api/nguoi', methods=['POST'])
@can_dang_nhap
def api_tao_nguoi():
    """Tạo người mới + chụp ngay ảnh đầu tiên (không có khuôn mặt thì không tạo)."""
    info = request.get_json(silent=True) or {}
    ma_la = str(info.get('tu_anh_la') or '')
    if ma_la:                                       # đăng ký từ ảnh người lạ trong nhật ký
        face = danh_ba.doc_anh_la(ma_la) if ma_la.isalnum() else None
        if face is None:
            return tra_loi_loi('khong_thay_anh', ma_http=404)
        with khoa:
            loi, so_mat, nid = danh_ba.tao_nguoi(info, face=face)
        if not loi:
            danh_ba.lien_ket_anh_la(ma_la, danh_ba.nguoi[nid])
    else:
        if khung_moi is None:
            return tra_loi_loi('chua_co_hinh', ma_http=503)
        with khoa:
            loi, so_mat, nid = danh_ba.tao_nguoi(info, khung_moi.copy())
    if loi:
        return tra_loi_loi(loi, so_mat)
    return jsonify({'ok': True, 'id': nid, 'thong_bao': tb('da_tao', ten=danh_ba.nguoi[nid]['ho_ten'])})


@app.route('/api/nguoi/<int:nid>')
@can_dang_nhap
def api_ho_so(nid):
    with khoa:
        if nid not in danh_ba.nguoi:
            return tra_loi_loi('khong_thay_nguoi', ma_http=404)
        return jsonify(danh_ba.ho_so(nid))


@app.route('/api/nguoi/<int:nid>', methods=['PUT'])
@can_dang_nhap
def api_sua_nguoi(nid):
    with khoa:
        loi = danh_ba.sua_nguoi(nid, request.get_json(silent=True) or {})
    if loi:
        return tra_loi_loi(loi, ma_http=404 if loi == 'khong_thay_nguoi' else 400)
    return jsonify({'ok': True, 'thong_bao': tb('da_luu_ho_so')})


@app.route('/api/nguoi/<int:nid>', methods=['DELETE'])
@can_dang_nhap
def api_xoa_nguoi(nid):
    with khoa:
        if nid not in danh_ba.nguoi:
            return tra_loi_loi('khong_thay_nguoi', ma_http=404)
        ten = danh_ba.nguoi[nid]['ho_ten']
        danh_ba.xoa_nguoi(nid)
    return jsonify({'ok': True, 'thong_bao': tb('da_xoa_nguoi', ten=ten)})


@app.route('/api/nguoi/<int:nid>/anh', methods=['POST'])
@can_dang_nhap
def api_them_anh(nid):
    """Chụp thêm 1 ảnh từ camera cho người đã có."""
    if khung_moi is None:
        return tra_loi_loi('chua_co_hinh', ma_http=503)
    with khoa:
        loi, so_mat = danh_ba.them_anh(nid, khung_moi.copy())
        if loi:
            return tra_loi_loi(loi, so_mat, 404 if loi == 'khong_thay_nguoi' else 400)
        ten = danh_ba.nguoi[nid]['ho_ten']
        so = sum(1 for c in danh_ba.chu if c == nid)
    return jsonify({'ok': True, 'thong_bao': tb('da_them_anh', ten=ten, n=so)})


@app.route('/api/anh/<ma>')
@can_dang_nhap
def api_xem_anh(ma):
    p = danh_ba.duong_dan_anh(ma) if ma.isalnum() else None
    if not p or not os.path.exists(p):
        abort(404)
    return send_file(p, mimetype='image/jpeg', max_age=3600)


@app.route('/api/anh/<ma>', methods=['DELETE'])
@can_dang_nhap
def api_xoa_anh(ma):
    with khoa:
        nid = danh_ba.xoa_anh(ma)
        if nid is None:
            return tra_loi_loi('khong_thay_anh', ma_http=404)
        ten = danh_ba.nguoi[nid]['ho_ten']
        con = sum(1 for c in danh_ba.chu if c == nid)
    return jsonify({'ok': True, 'thong_bao': tb('da_xoa_anh', ten=ten) + ('' if con else tb('het_anh', ten=ten))})


# ---------- Nhật ký ra vào ----------
def doc_bo_loc():
    ngay = request.args.get('ngay') or None
    loai = request.args.get('loai') or None
    nguoi = request.args.get('nguoi', type=int)
    gioi_han = min(request.args.get('gioi_han', 500, type=int), 5000)
    return dict(ngay=ngay, loai=loai, nguoi_id=nguoi, gioi_han=gioi_han)


@app.route('/api/nhat_ky')
@can_dang_nhap
def api_nhat_ky():
    return jsonify(danh_ba.nhat_ky(**doc_bo_loc()))


@app.route('/api/nhat_ky.csv')
@can_dang_nhap
def api_nhat_ky_csv():
    """File CSV để mở bằng Excel (có BOM để Excel đọc đúng tiếng Việt)."""
    import csv, io
    bl = doc_bo_loc()
    vi = cai_dat.get('ngon_ngu', 'en') == 'vi'
    dau = (['Thời gian', 'Loại', 'Mã NV', 'Họ tên', 'Phòng ban / Đơn vị', 'Khoảng cách'] if vi else
           ['Time', 'Type', 'Employee ID', 'Name', 'Department / Company', 'Distance'])
    ten_loai = {'nhan_vien': ('Nhân viên', 'Employee'), 'khach': ('Khách', 'Guest'), 'la': ('Người lạ', 'Unknown')}
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(dau)
    for r in danh_ba.nhat_ky(**{**bl, 'gioi_han': 100000}):
        loai = 'la' if r['loai'] == 'la' else r['loai_nguoi']
        w.writerow([r['thoi_gian'].replace('T', ' '), ten_loai.get(loai, ('', ''))[0 if vi else 1], r['ma_nv'] or '',
                    r['ho_ten'], (r['phong_ban'] if loai == 'nhan_vien' else r['don_vi']) or '',
                    '' if r['khoang_cach'] is None else r['khoang_cach']])
    ten_file = f"nhat_ky_{bl['ngay'] or 'tat_ca'}.csv"
    return Response('\ufeff' + buf.getvalue(), mimetype='text/csv; charset=utf-8',
                    headers={'Content-Disposition': f'attachment; filename="{ten_file}"'})


@app.route('/api/tong_quan')
@can_dang_nhap
def api_tong_quan():
    return jsonify(danh_ba.tom_tat_ngay(request.args.get('ngay') or None))


@app.route('/api/anh_la/<ma>', methods=['DELETE'])
@can_dang_nhap
def api_xoa_anh_la(ma):
    if not ma.isalnum() or not danh_ba.xoa_anh_la(ma):
        return tra_loi_loi('khong_thay_anh', ma_http=404)
    return jsonify({'ok': True, 'thong_bao': tb('da_xoa_anh_la')})


def loi_chao_hien_tai():
    """Lời chào của ngôn ngữ đang dùng: ô nào chưa tự đặt thì lấy mặc định."""
    nn = cai_dat.get('ngon_ngu', 'en')
    return {**LOI_CHAO_MAC_DINH[nn], **cai_dat.get('loi_chao', {}).get(nn, {})}


@app.route('/api/man_chao')
def api_man_chao():
    return jsonify({'ngon_ngu': cai_dat.get('ngon_ngu', 'en'), 'loi_chao': loi_chao_hien_tai()})


@app.route('/api/cai_dat')
@can_dang_nhap
def api_xem_cai_dat():
    nn = cai_dat.get('ngon_ngu', 'en')
    return jsonify({'giu_anh_la_ngay': giu_anh_la_ngay(), 'cac_lua_chon': GIU_ANH_LA_CHON,
                    'loi_chao': loi_chao_hien_tai(), 'loi_chao_mac_dinh': LOI_CHAO_MAC_DINH[nn]})


@app.route('/api/cai_dat', methods=['PUT'])
@can_dang_nhap
def api_sua_cai_dat():
    moi = request.get_json(silent=True) or {}
    if 'giu_anh_la_ngay' in moi:
        if moi['giu_anh_la_ngay'] not in GIU_ANH_LA_CHON:
            return tra_loi_loi('sai_gia_tri')
        cai_dat['giu_anh_la_ngay'] = moi['giu_anh_la_ngay']
        luu_cai_dat(cai_dat)
        danh_ba.don_anh_la(cai_dat['giu_anh_la_ngay'])        # rút ngắn thời hạn -> xóa ngay ảnh quá hạn
    if 'loi_chao' in moi:                                      # lời chào của ngôn ngữ đang dùng
        nn = cai_dat.get('ngon_ngu', 'en')
        lc = moi['loi_chao'] if isinstance(moi['loi_chao'], dict) else {}
        rieng = {}
        for k in LOI_CHAO_MAC_DINH[nn]:
            v = str(lc.get(k) or '').strip()[:80]
            if v and v != LOI_CHAO_MAC_DINH[nn][k]:            # để trống / giống mặc định -> dùng mặc định
                rieng[k] = v
        cai_dat.setdefault('loi_chao', {})[nn] = rieng
        luu_cai_dat(cai_dat)
    return jsonify({'ok': True, 'thong_bao': tb('da_luu_cai_dat')})


@app.route('/api/doi_mat_khau', methods=['POST'])
@can_dang_nhap
def api_doi_mat_khau():
    d = request.get_json(silent=True) or {}
    if not check_password_hash(cai_dat['mat_khau'], d.get('cu', '')):
        time.sleep(1)
        return tra_loi_loi('sai_mat_khau_cu')                 # 400 chứ không phải 401 (401 = hết phiên đăng nhập)
    if len(d.get('moi', '')) < 6:
        return tra_loi_loi('mat_khau_ngan')
    cai_dat['mat_khau'] = generate_password_hash(d['moi'])
    cai_dat['khoa_phien'] = secrets.token_hex(32)               # đổi khóa ký -> mọi phiên đăng nhập cũ hết hiệu lực
    luu_cai_dat(cai_dat)
    app.secret_key = cai_dat['khoa_phien']
    session['quan_tri'] = True                                 # riêng trình duyệt này vẫn đăng nhập (cookie ký bằng khóa mới)
    return jsonify({'ok': True, 'thong_bao': tb('da_doi_mat_khau')})


@app.route('/api/anh_la/<ma>')
@can_dang_nhap
def api_anh_la(ma):
    p = danh_ba.duong_dan_anh_la(ma) if ma.isalnum() else None
    if not p or not os.path.exists(p):
        abort(404)
    return send_file(p, mimetype='image/jpeg', max_age=3600)


if __name__ == '__main__':
    print('Cơ sở dữ liệu   :', FILE_DU_LIEU, f'({danh_ba.so_nguoi()} người, {danh_ba.so_anh()} ảnh)')
    print('Giao diện       :', FRONTEND_DIR,
          sorted(os.listdir(FRONTEND_DIR)) if os.path.isdir(FRONTEND_DIR) else '-> KHÔNG CÓ THƯ MỤC frontend!')
    chay_khong_dung(doc_camera)
    chay_khong_dung(bam_mat_lien_tuc)
    chay_khong_dung(nhan_dien_lien_tuc)
    chay_khong_dung(don_dep_dinh_ky)
    print('Mở http://localhost:5000 để xem màn hình chào')
    app.run(host='0.0.0.0', port=5000, threaded=True)
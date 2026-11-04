"""
face_core.py — Phần lõi nhận diện khuôn mặt
Kết quả nghiên cứu (notebook 01, 02): ArcFace + retinaface, ngưỡng 0.55
"""
import os
os.environ['TF_USE_LEGACY_KERAS'] = '1'   # retinaface cần Keras cũ (phải đặt trước khi nạp tensorflow)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import base64
import uuid
import cv2
import numpy as np
from deepface import DeepFace

# ==== CẤU HÌNH (từ kết quả notebook 02) ====
MODEL    = 'ArcFace'
DETECTOR = 'retinaface'
NGUONG   = 0.55

DIEM_MOC = ['left_eye', 'right_eye', 'nose', 'mouth_left', 'mouth_right']   # 5 điểm mốc retinaface trả về


def tach_mat(img):
    """Tìm mọi khuôn mặt trong ảnh (ảnh BGR của OpenCV hoặc đường dẫn).
    Trả về danh sách: [{'face': ảnh mặt BGR, 'box': (x, y, w, h), 'diem': [[x, y], ...]}, ...]"""
    res = DeepFace.extract_faces(img, detector_backend=DETECTOR, enforce_detection=False,
                                 color_face='bgr', normalize_face=False)
    mats = []
    for r in res:
        if r['confidence'] > 0:                      # confidence = 0 nghĩa là không thấy mặt
            a = r['facial_area']
            diem = {k: a.get(k) for k in DIEM_MOC if a.get(k) is not None}
            mats.append({'face': r['face'].astype('uint8'),
                         'box': (a['x'], a['y'], a['w'], a['h']),
                         'diem': diem})
    return mats


# ---------- Tìm mặt NHANH (chỉ để khung bám theo mặt, không dùng để nhận diện) ----------
# retinaface chính xác nhưng chậm (~3 giây/khung trên CPU). YuNet của OpenCV chỉ ~20 ms
# nên chạy được trên mọi khung hình. File mô hình 230 KB, tự tải về lần đầu.
FILE_YUNET = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'face_detection_yunet_2023mar.onnx')
URL_YUNET  = ['https://media.githubusercontent.com/media/opencv/opencv_zoo/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx',
              'https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx']
_yunet = None        # None = chưa nạp, False = không dùng được (chuyển sang Haar)
_haar = None
BAM_MAT = '?'        # cách bám mặt đang dùng thật sự: 'yunet', 'haar' hoặc 'retinaface' (dự phòng)


def _nap_yunet():
    """Tải (nếu chưa có) và nạp YuNet. Lỗi gì cũng không dừng chương trình: chuyển sang Haar."""
    global _yunet, BAM_MAT
    try:
        if not os.path.exists(FILE_YUNET) or os.path.getsize(FILE_YUNET) < 100_000:
            import urllib.request
            for url in URL_YUNET:
                try:
                    print('Đang tải mô hình YuNet (230 KB) từ', url.split('/')[2], '...')
                    du_lieu = urllib.request.urlopen(url, timeout=20).read()
                    if len(du_lieu) > 100_000:                      # file thật ~230 KB
                        open(FILE_YUNET, 'wb').write(du_lieu)
                        break
                    print('  -> file tải về không đúng, thử link khác')
                except Exception as e:
                    print('  -> lỗi:', e)
        # Đọc file bằng Python rồi đưa cho OpenCV: OpenCV trên Windows không mở được
        # đường dẫn có chữ tiếng Việt (vd. "Dự án ttdn"), Python thì đọc được.
        mo_hinh = np.fromfile(FILE_YUNET, dtype=np.uint8)
        _yunet = cv2.FaceDetectorYN.create('onnx', mo_hinh, np.array([], np.uint8), (0, 0), 0.8)  # 0.8 = độ tin cậy tối thiểu
        BAM_MAT = 'yunet'
        print('Bám mặt bằng YuNet: OK')
    except Exception as e:
        _yunet = False
        print('KHÔNG dùng được YuNet:', e)
        _nap_haar()


def _nap_haar():
    """Dự phòng 1: Haar cascade đi kèm OpenCV. Không có thì dự phòng 2: retinaface (chậm như bản cũ)."""
    global _haar, BAM_MAT
    duong_dan = os.path.join(getattr(cv2, 'data', None).haarcascades if hasattr(cv2, 'data') else '',
                             'haarcascade_frontalface_default.xml')
    _haar = cv2.CascadeClassifier(duong_dan) if os.path.exists(duong_dan) else None
    if _haar is not None and not _haar.empty():
        BAM_MAT = 'haar'
        print('-> Bám mặt bằng Haar cascade của OpenCV (không có 5 điểm mốc)')
    else:
        _haar = False
        BAM_MAT = 'retinaface'
        print('-> Không có Haar cascade. Bám mặt bằng retinaface (chậm, khung sẽ trễ như bản cũ)')


def tim_mat_nhanh(img):
    """Vị trí các khuôn mặt: [{'box': (x, y, w, h), 'diem': [[x, y] x 5]}, ...]"""
    if _yunet is None:
        _nap_yunet()
    H, W = img.shape[:2]
    if _yunet is False and _haar:                          # dự phòng 1: Haar cascade
        xam = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return [{'box': tuple(int(v) for v in b), 'diem': []}
                for b in _haar.detectMultiScale(xam, 1.1, 5, minSize=(60, 60))]
    if _yunet is False:                                    # dự phòng 2: retinaface
        # giữ luôn ảnh mặt đã tách ('mat') để luồng nhận diện dùng lại, khỏi chạy retinaface lần 2
        return [{'box': m['box'], 'diem': [list(p) for p in m['diem'].values()], 'mat': m} for m in tach_mat(img)]

    _yunet.setInputSize((W, H))
    _, ket_qua = _yunet.detect(img)
    mats = []
    for f in (ket_qua if ket_qua is not None else []):
        x, y, w, h = [int(v) for v in f[:4]]
        x, y = max(0, x), max(0, y)
        w, h = min(w, W - x), min(h, H - y)
        diem = [[int(f[i]), int(f[i + 1])] for i in range(4, 14, 2)]   # 2 mắt, mũi, 2 khóe miệng
        mats.append({'box': (x, y, w, h), 'diem': diem})
    return mats


def tao_vector(face):
    """Biến 1 ảnh khuôn mặt (đã tách) thành vector, chuẩn hóa độ dài = 1."""
    v = DeepFace.represent(face, model_name=MODEL, detector_backend='skip', enforce_detection=False)
    v = np.array(v[0]['embedding'], dtype=np.float32)
    return v / np.linalg.norm(v)


# ---------- Các chỉ số phụ cho chế độ thông số ----------

def chat_luong(face, diem):
    """3 chỉ số từ 0 đến 1: góc mặt (nhìn thẳng = 1), độ nét, độ tương phản."""
    xam = cv2.cvtColor(cv2.resize(face, (112, 112)), cv2.COLOR_BGR2GRAY)
    do_net = min(1.0, float(cv2.Laplacian(xam, cv2.CV_64F).var()) / 300)
    tuong_phan = min(1.0, float(xam.std()) / 64)
    goc_mat = None
    if all(k in diem for k in ('left_eye', 'right_eye', 'nose')):
        (x1, _), (x2, _), (xm, _) = diem['left_eye'], diem['right_eye'], diem['nose']
        nua = abs(x1 - x2) / 2
        if nua > 0:
            goc_mat = max(0.0, 1 - abs(xm - (x1 + x2) / 2) / nua)   # mũi càng lệch khỏi giữa hai mắt càng nghiêng
    return {'goc_mat': None if goc_mat is None else round(goc_mat, 2),
            'do_net': round(do_net, 2), 'tuong_phan': round(tuong_phan, 2)}


def anh_nho(face, cao=96):
    """Ảnh mặt thu nhỏ dạng base64 để trang web hiện ra (không lưu lại ở đâu)."""
    h, w = face.shape[:2]
    nho = cv2.resize(face, (max(1, int(w * cao / h)), cao))
    _, jpg = cv2.imencode('.jpg', nho, [cv2.IMWRITE_JPEG_QUALITY, 80])
    return 'data:image/jpeg;base64,' + base64.b64encode(jpg.tobytes()).decode()


# =====================================================================
#  DANH BẠ: người đã đăng ký (Nhân viên / Khách) + ảnh mặt, lưu trong SQLite
#  Bảng `nguoi`: thông tin hồ sơ.  Bảng `anh`: mỗi ảnh 1 dòng (mã ảnh, của ai, vector).
# =====================================================================
LOAI_NGUOI = ('nhan_vien', 'khach')
TRUONG = ('loai', 'ma_nv', 'ho_ten', 'danh_xung', 'phong_ban', 'chuc_vu',   # các ô trong hồ sơ
          'don_vi', 'gap_ai', 'het_han', 'trang_thai', 'ghi_chu', 'dong_y')


class DanhBa:
    """Danh sách người đã đăng ký và các vector khuôn mặt của họ."""

    def __init__(self, file_db, thu_muc_anh, file_cu=None, thu_muc_anh_la=None):
        import sqlite3, threading
        self.thu_muc_anh = thu_muc_anh
        self.thu_muc_anh_la = thu_muc_anh_la or os.path.join(os.path.dirname(thu_muc_anh), 'anh_nguoi_la')
        self._khoa = threading.Lock()
        self.db = sqlite3.connect(file_db, check_same_thread=False)
        self.db.row_factory = sqlite3.Row
        self.db.executescript("""
            CREATE TABLE IF NOT EXISTS nguoi (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                loai TEXT NOT NULL DEFAULT 'nhan_vien',   -- nhan_vien | khach
                ma_nv TEXT, ho_ten TEXT NOT NULL, danh_xung TEXT DEFAULT '',
                phong_ban TEXT DEFAULT '', chuc_vu TEXT DEFAULT '',          -- nhân viên
                don_vi TEXT DEFAULT '', gap_ai TEXT DEFAULT '', het_han TEXT DEFAULT '',   -- khách
                trang_thai TEXT DEFAULT 'dang_lam',       -- dang_lam | da_nghi (nhân viên)
                ghi_chu TEXT DEFAULT '', dong_y INTEGER DEFAULT 0, ngay_tao TEXT);
            CREATE TABLE IF NOT EXISTS anh (
                ma TEXT PRIMARY KEY, nguoi_id INTEGER NOT NULL, vec BLOB NOT NULL, ngay_tao TEXT);
            -- Nhật ký ra vào: mỗi lần chào 1 người (loai = 'chao') hoặc gặp người lạ (loai = 'la')
            CREATE TABLE IF NOT EXISTS nhat_ky (
                id INTEGER PRIMARY KEY AUTOINCREMENT, loai TEXT NOT NULL, thoi_gian TEXT NOT NULL,
                nguoi_id INTEGER, ho_ten TEXT DEFAULT '', loai_nguoi TEXT DEFAULT '',   -- giữ tên lúc đó, phòng khi người bị xóa
                khoang_cach REAL, ma_anh TEXT);                                       -- ảnh chụp người lạ
            CREATE INDEX IF NOT EXISTS nk_thoi_gian ON nhat_ky (thoi_gian);
        """)
        self.db.commit()
        if file_cu and os.path.exists(file_cu) and not self.db.execute('SELECT 1 FROM nguoi').fetchone():
            self._chuyen_tu_file_cu(file_cu)
        self._nap()

    # ---------- đọc toàn bộ vào bộ nhớ (để so khớp nhanh) ----------
    def _nap(self):
        self.nguoi = {r['id']: dict(r) for r in self.db.execute('SELECT * FROM nguoi')}
        hang = self.db.execute('SELECT ma, nguoi_id, vec FROM anh ORDER BY ngay_tao, rowid').fetchall()
        self.ma = [r['ma'] for r in hang]
        self.chu = [r['nguoi_id'] for r in hang]                       # ảnh thứ i là của người nào
        self.vec = [np.frombuffer(r['vec'], dtype=np.float32) for r in hang]
        self._ban_do = None

    def _chuyen_tu_file_cu(self, file_cu):
        """Lần đầu chạy bản mới: chuyển danh_ba.npz cũ (chỉ có tên) sang SQLite. Mỗi tên thành 1 nhân viên."""
        d = np.load(file_cu)
        ten = [str(t) for t in d['ten']]
        ma = [str(m) for m in d['ma']] if 'ma' in d.files else [uuid.uuid4().hex[:12] for _ in ten]
        id_theo_ten = {}
        bay_gio = _bay_gio()
        for i, t in enumerate(ten):
            if t not in id_theo_ten:
                cur = self.db.execute(
                    "INSERT INTO nguoi (loai, ma_nv, ho_ten, trang_thai, dong_y, ngay_tao) VALUES ('nhan_vien', ?, ?, 'dang_lam', 0, ?)",
                    (f'NV{len(id_theo_ten) + 1:03d}', t, bay_gio))
                id_theo_ten[t] = cur.lastrowid
            self.db.execute('INSERT INTO anh (ma, nguoi_id, vec, ngay_tao) VALUES (?, ?, ?, ?)',
                            (ma[i], id_theo_ten[t], np.asarray(d['vec'][i], np.float32).tobytes(), bay_gio))
        self.db.commit()
        d.close()
        os.replace(file_cu, file_cu + '.cu')          # giữ lại bản cũ phòng khi cần
        print(f'Đã chuyển {len(id_theo_ten)} người, {len(ten)} ảnh từ {os.path.basename(file_cu)} sang cơ sở dữ liệu mới')

    # ---------- người còn được chào không ----------
    @staticmethod
    def con_hieu_luc(n):
        """Nhân viên đã nghỉ, hoặc khách đã quá ngày hết hạn -> không chào nữa."""
        if n['loai'] == 'nhan_vien':
            return n['trang_thai'] != 'da_nghi'
        return not n['het_han'] or n['het_han'] >= _hom_nay()

    # ---------- kiểm tra dữ liệu nhập ----------
    def _kiem_tra(self, info, id_bo_qua=None):
        """Trả về mã lỗi (chuỗi) hoặc None nếu hợp lệ."""
        if info.get('loai') not in LOAI_NGUOI:
            return 'sai_loai'
        if not info.get('ho_ten', '').strip():
            return 'thieu_ten'
        if info['loai'] == 'nhan_vien':
            ma_nv = info.get('ma_nv', '').strip()
            if not ma_nv:
                return 'thieu_ma_nv'
            trung = self.db.execute("SELECT id FROM nguoi WHERE loai = 'nhan_vien' AND lower(ma_nv) = lower(?) AND id != ?",
                                    (ma_nv, id_bo_qua or -1)).fetchone()
            if trung:
                return 'trung_ma_nv'
        het_han = info.get('het_han', '')
        if het_han:
            try:
                import datetime
                datetime.date.fromisoformat(het_han)
            except ValueError:
                return 'sai_ngay'
        return None

    @staticmethod
    def _lam_sach(info):
        """Chỉ giữ các ô hợp lệ, cắt khoảng trắng thừa."""
        kq = {}
        for k in TRUONG:
            if k in info:
                v = info[k]
                kq[k] = (1 if v else 0) if k == 'dong_y' else str(v or '').strip()[:200]
        if kq.get('loai') == 'khach':
            kq['ma_nv'] = ''
        return kq

    # ---------- thêm / sửa / xóa ----------
    def tao_nguoi(self, info, img=None, face=None):
        """Tạo người mới KÈM ảnh đầu tiên (chụp không được thì không tạo).
        img  = khung hình camera (sẽ tìm mặt trong đó), hoặc
        face = ảnh mặt đã tách sẵn (ví dụ ảnh chụp người lạ trong nhật ký).
        Trả về (mã lỗi hoặc None, số khuôn mặt thấy được, id người mới)."""
        info = self._lam_sach(info)
        loi = self._kiem_tra(info)
        if loi:
            return loi, None, None
        if not info.get('dong_y'):
            return 'chua_dong_y', None, None
        if face is None:
            mats = tach_mat(img)
            if len(mats) != 1:
                return 'sai_so_mat', len(mats), None
            face = mats[0]['face']
        vec = tao_vector(face)
        with self._khoa:
            cot = [k for k in TRUONG if k in info] + ['ngay_tao']
            cur = self.db.execute(f"INSERT INTO nguoi ({', '.join(cot)}) VALUES ({', '.join('?' * len(cot))})",
                                  [info[k] for k in cot[:-1]] + [_bay_gio()])
            nid = cur.lastrowid
            self._ghi_anh(nid, vec, face)
            self.db.commit()
            self._nap()
        return None, 1, nid

    def them_anh(self, nid, img):
        """Thêm 1 ảnh cho người đã có. Trả về (mã lỗi hoặc None, số khuôn mặt)."""
        if nid not in self.nguoi:
            return 'khong_thay_nguoi', None
        mats = tach_mat(img)
        if len(mats) != 1:
            return 'sai_so_mat', len(mats)
        vec = tao_vector(mats[0]['face'])
        with self._khoa:
            self._ghi_anh(nid, vec, mats[0]['face'])
            self.db.commit()
            self._nap()
        return None, 1

    def _ghi_anh(self, nid, vec, face):
        ma = uuid.uuid4().hex[:12]
        self.db.execute('INSERT INTO anh (ma, nguoi_id, vec, ngay_tao) VALUES (?, ?, ?, ?)',
                        (ma, nid, np.asarray(vec, np.float32).tobytes(), _bay_gio()))
        os.makedirs(self.thu_muc_anh, exist_ok=True)
        _, jpg = cv2.imencode('.jpg', face, [cv2.IMWRITE_JPEG_QUALITY, 90])
        with open(self.duong_dan_anh(ma), 'wb') as f:    # ghi bằng Python: chịu được đường dẫn tiếng Việt
            f.write(jpg.tobytes())

    def sua_nguoi(self, nid, info):
        """Sửa hồ sơ. Trả về mã lỗi hoặc None."""
        if nid not in self.nguoi:
            return 'khong_thay_nguoi'
        moi = {**self.nguoi[nid], **self._lam_sach(info)}
        loi = self._kiem_tra(moi, id_bo_qua=nid)
        if loi:
            return loi
        with self._khoa:
            cot = list(TRUONG)
            self.db.execute(f"UPDATE nguoi SET {', '.join(f'{k} = ?' for k in cot)} WHERE id = ?",
                            [moi[k] for k in cot] + [nid])
            self.db.commit()
            self._nap()
        return None

    def xoa_nguoi(self, nid):
        with self._khoa:
            for (ma,) in self.db.execute('SELECT ma FROM anh WHERE nguoi_id = ?', (nid,)).fetchall():
                self._xoa_file_anh(ma)
            self.db.execute('DELETE FROM anh WHERE nguoi_id = ?', (nid,))
            self.db.execute('DELETE FROM nguoi WHERE id = ?', (nid,))
            self.db.commit()
            self._nap()

    def xoa_anh(self, ma):
        """Xóa 1 ảnh. Trả về id người có ảnh đó, None nếu không thấy."""
        hang = self.db.execute('SELECT nguoi_id FROM anh WHERE ma = ?', (ma,)).fetchone()
        if not hang:
            return None
        with self._khoa:
            self.db.execute('DELETE FROM anh WHERE ma = ?', (ma,))
            self.db.commit()
            self._xoa_file_anh(ma)
            self._nap()
        return hang['nguoi_id']

    # ---------- ảnh mặt đã đăng ký ----------
    def duong_dan_anh(self, ma):
        return os.path.join(self.thu_muc_anh, f'{ma}.jpg')

    def _xoa_file_anh(self, ma):
        p = self.duong_dan_anh(ma)
        if os.path.exists(p):
            os.remove(p)

    # ---------- đọc ra cho trang quản lý ----------
    def ho_so(self, nid):
        n = dict(self.nguoi[nid])
        n['anh'] = [{'ma': m, 'co_anh': os.path.exists(self.duong_dan_anh(m))} for m, c in zip(self.ma, self.chu) if c == nid]
        n['con_hieu_luc'] = self.con_hieu_luc(n)
        return n

    def danh_sach(self):
        """Mọi người, sắp theo tên."""
        return sorted((self.ho_so(i) for i in self.nguoi), key=lambda n: n['ho_ten'].lower())

    def so_nguoi(self):
        return len(self.nguoi)

    def so_anh(self):
        return len(self.ma)

    # ---------- nhận diện ----------
    def _chi_so_hieu_luc(self):
        """Vị trí các ảnh của người còn được chào."""
        return [i for i, c in enumerate(self.chu) if c in self.nguoi and self.con_hieu_luc(self.nguoi[c])]

    def phan_tich(self, face):
        """Nhận diện 1 khuôn mặt. Trả về người (None nếu người lạ), khoảng cách,
        3 ứng viên gần nhất và vị trí trên bản đồ."""
        v = tao_vector(face)
        chi_so = self._chi_so_hieu_luc()
        if not chi_so:
            return {'nguoi': None, 'khoang_cach': 1.0, 'ung_vien': [], 'xy': None}
        dist = 1 - np.stack([self.vec[i] for i in chi_so]) @ v      # khoảng cách cosine tới mọi ảnh
        gan_nhat = {}                                                # mỗi người lấy ảnh gần nhất
        for i, d in zip(chi_so, dist):
            gan_nhat[self.chu[i]] = min(gan_nhat.get(self.chu[i], 9), float(d))
        ung_vien = sorted(gan_nhat.items(), key=lambda x: x[1])[:3]
        nid, d = ung_vien[0]
        return {'nguoi': self.nguoi[nid] if d < NGUONG else None, 'khoang_cach': d,
                'ung_vien': [[self.nguoi[i]['ho_ten'], round(x, 3)] for i, x in ung_vien],
                'xy': self.chieu_len_ban_do(v)}

    # ---------- Bản đồ khuôn mặt: ép vector 512 chiều xuống 2 chiều (PCA) ----------
    def _tinh_ban_do(self):
        chi_so = self._chi_so_hieu_luc()
        if self._ban_do is None and len(chi_so) >= 2:
            X = np.stack([self.vec[i] for i in chi_so])
            tb = X.mean(axis=0)
            _, _, Vt = np.linalg.svd(X - tb, full_matrices=False)
            truc = Vt[:2]                                      # 2 hướng biến thiên nhiều nhất
            P = (X - tb) @ truc.T
            thap, cao = P.min(axis=0), P.max(axis=0)
            le = (cao - thap) * 0.25 + 1e-6                    # chừa lề để khuôn mặt lạ không tràn ra ngoài
            self._ban_do = (tb, truc, thap - le, cao + le)
        return self._ban_do

    def chieu_len_ban_do(self, v):
        bd = self._tinh_ban_do()
        if bd is None:
            return None
        tb, truc, thap, cao = bd
        p = ((v - tb) @ truc.T - thap) / (cao - thap)
        return [round(float(np.clip(p[0], 0, 1)), 3), round(float(np.clip(p[1], 0, 1)), 3)]

    def diem_ban_do(self):
        """Vị trí các ảnh đã đăng ký (của người còn hiệu lực) trên bản đồ: [{'ten', 'x', 'y'}, ...]"""
        if self._tinh_ban_do() is None:
            return []
        return [{'ten': self.nguoi[self.chu[i]]['ho_ten'], 'x': xy[0], 'y': xy[1]}
                for i, xy in ((i, self.chieu_len_ban_do(self.vec[i])) for i in self._chi_so_hieu_luc())]


# =====================================================================
#  NHẬT KÝ RA VÀO (thêm vào DanhBa vì dùng chung cơ sở dữ liệu)
# =====================================================================
def _ghi_su_kien(self, loai, nguoi=None, khoang_cach=None, face=None, cach_toi_thieu=600, luu_anh=True):
    """Ghi 1 sự kiện. loai = 'chao' (người quen) hoặc 'la' (người lạ, kèm ảnh chụp).
    Người quen đã được ghi trong `cach_toi_thieu` giây gần đây thì không ghi lại (như máy chấm công).
    Trả về True nếu đã ghi."""
    import datetime
    bay_gio = datetime.datetime.now()
    with self._khoa:
        if loai == 'chao':
            cu = self.db.execute("SELECT thoi_gian FROM nhat_ky WHERE loai = 'chao' AND nguoi_id = ? ORDER BY id DESC LIMIT 1",
                                 (nguoi['id'],)).fetchone()
            if cu and (bay_gio - datetime.datetime.fromisoformat(cu[0])).total_seconds() < cach_toi_thieu:
                return False
        ma_anh = None
        if face is not None and luu_anh:
            ma_anh = uuid.uuid4().hex[:12]
            os.makedirs(self.thu_muc_anh_la, exist_ok=True)
            _, jpg = cv2.imencode('.jpg', face, [cv2.IMWRITE_JPEG_QUALITY, 95])   # nét, vì có thể dùng để đăng ký
            with open(os.path.join(self.thu_muc_anh_la, f'{ma_anh}.jpg'), 'wb') as f:
                f.write(jpg.tobytes())
        self.db.execute('INSERT INTO nhat_ky (loai, thoi_gian, nguoi_id, ho_ten, loai_nguoi, khoang_cach, ma_anh) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        (loai, bay_gio.isoformat(timespec='seconds'), nguoi['id'] if nguoi else None,
                         nguoi['ho_ten'] if nguoi else '', nguoi['loai'] if nguoi else '',
                         None if khoang_cach is None else round(float(khoang_cach), 3), ma_anh))
        self.db.commit()
    return True


def _nhat_ky(self, ngay=None, nguoi_id=None, loai=None, gioi_han=500):
    """Các sự kiện mới nhất trước. ngay = 'YYYY-MM-DD'; loai = 'nhan_vien' | 'khach' | 'la'."""
    dk, ts = [], []
    if ngay:
        dk.append('substr(k.thoi_gian, 1, 10) = ?'); ts.append(ngay)
    if nguoi_id:
        dk.append('k.nguoi_id = ?'); ts.append(nguoi_id)
    if loai == 'la':
        dk.append("k.loai = 'la'")
    elif loai in LOAI_NGUOI:
        dk.append("k.loai = 'chao' AND k.loai_nguoi = ?"); ts.append(loai)
    sql = ('SELECT k.*, n.ma_nv, n.phong_ban, n.don_vi, n.danh_xung, (n.id IS NOT NULL) AS con_ho_so '
           'FROM nhat_ky k LEFT JOIN nguoi n ON n.id = k.nguoi_id '
           + ('WHERE ' + ' AND '.join(dk) if dk else '') + ' ORDER BY k.id DESC LIMIT ?')
    with self._khoa:
        hang = self.db.execute(sql, ts + [gioi_han]).fetchall()
    kq = []
    for r in hang:
        r = dict(r)
        anh = [m for m, c in zip(self.ma, self.chu) if c == r['nguoi_id']] if r['nguoi_id'] else []
        r['anh_dai_dien'] = next((m for m in anh if os.path.exists(self.duong_dan_anh(m))), None)
        kq.append(r)
    return kq


def _tom_tat_ngay(self, ngay=None):
    """Số liệu 1 ngày cho trang Tổng quan: nhân viên đã đến / chưa đến, khách, người lạ, lượt theo giờ."""
    ngay = ngay or _hom_nay()
    with self._khoa:
        hang = self.db.execute('SELECT loai, nguoi_id, loai_nguoi, thoi_gian FROM nhat_ky WHERE substr(thoi_gian, 1, 10) = ? ORDER BY id',
                               (ngay,)).fetchall()
    gio_den = {}                                    # nhân viên -> giờ đến sớm nhất trong ngày
    khach, so_la, theo_gio = set(), 0, [0] * 24
    for r in hang:
        theo_gio[int(r['thoi_gian'][11:13])] += 1
        if r['loai'] == 'la':
            so_la += 1
        elif r['loai_nguoi'] == 'khach':
            khach.add(r['nguoi_id'])
        else:
            gio_den.setdefault(r['nguoi_id'], r['thoi_gian'][11:16])
    nv = [n for n in self.nguoi.values() if n['loai'] == 'nhan_vien' and self.con_hieu_luc(n)]
    ten = lambda n: {'id': n['id'], 'ho_ten': n['ho_ten'], 'phong_ban': n['phong_ban'], 'ma_nv': n['ma_nv']}
    return {
        'ngay': ngay,
        'so_nhan_vien': len(nv),
        'da_den': sorted(({**ten(n), 'gio_den': gio_den[n['id']]} for n in nv if n['id'] in gio_den), key=lambda x: x['gio_den']),
        'chua_den': sorted((ten(n) for n in nv if n['id'] not in gio_den), key=lambda x: x['ho_ten'].lower()),
        'so_khach': len(khach), 'so_la': so_la, 'so_luot': len(hang), 'theo_gio': theo_gio,
    }


def _duong_dan_anh_la(self, ma):
    return os.path.join(self.thu_muc_anh_la, f'{ma}.jpg')


def _doc_anh_la(self, ma):
    """Ảnh mặt người lạ đã lưu (để đăng ký thành người quen). None nếu không còn."""
    p = self.duong_dan_anh_la(ma)
    if not os.path.exists(p):
        return None
    return cv2.imdecode(np.fromfile(p, dtype=np.uint8), cv2.IMREAD_COLOR)    # đọc kiểu này chịu được đường dẫn tiếng Việt


def _lien_ket_anh_la(self, ma, nguoi):
    """Người lạ trong ảnh `ma` vừa được đăng ký -> nối các dòng nhật ký đó với hồ sơ mới."""
    with self._khoa:
        self.db.execute('UPDATE nhat_ky SET nguoi_id = ?, ho_ten = ?, loai_nguoi = ? WHERE ma_anh = ?',
                        (nguoi['id'], nguoi['ho_ten'], nguoi['loai'], ma))
        self.db.commit()


def _xoa_anh_la(self, ma):
    """Xóa 1 ảnh người lạ (dòng nhật ký vẫn giữ, chỉ mất ảnh). Trả về True nếu có ảnh đó."""
    with self._khoa:
        co = self.db.execute('UPDATE nhat_ky SET ma_anh = NULL WHERE ma_anh = ?', (ma,)).rowcount
        self.db.commit()
    p = self.duong_dan_anh_la(ma)
    if os.path.exists(p):
        os.remove(p)
        co = co or 1
    return bool(co)


def _don_anh_la(self, so_ngay):
    """Xóa ảnh người lạ cũ hơn `so_ngay` ngày (0 = xóa hết). Trả về số ảnh đã xóa."""
    import datetime
    moc = ('9999' if so_ngay <= 0 else                                # 0 ngày = xóa hết, kể cả ảnh vừa chụp
           (datetime.datetime.now() - datetime.timedelta(days=so_ngay)).isoformat(timespec='seconds'))
    with self._khoa:
        cu = [r[0] for r in self.db.execute('SELECT ma_anh FROM nhat_ky WHERE ma_anh IS NOT NULL AND thoi_gian < ?', (moc,))]
        con = {r[0] for r in self.db.execute('SELECT ma_anh FROM nhat_ky WHERE ma_anh IS NOT NULL AND thoi_gian >= ?', (moc,))}
        self.db.execute('UPDATE nhat_ky SET ma_anh = NULL WHERE ma_anh IS NOT NULL AND thoi_gian < ?', (moc,))
        self.db.commit()
    da_xoa = 0
    if os.path.isdir(self.thu_muc_anh_la):
        for ten in os.listdir(self.thu_muc_anh_la):                  # cả file lẻ không còn dòng nhật ký nào trỏ tới
            ma = os.path.splitext(ten)[0]
            if ma not in con:
                os.remove(os.path.join(self.thu_muc_anh_la, ten))
                da_xoa += 1
    return da_xoa


DanhBa.doc_anh_la = _doc_anh_la
DanhBa.lien_ket_anh_la = _lien_ket_anh_la
DanhBa.xoa_anh_la = _xoa_anh_la
DanhBa.don_anh_la = _don_anh_la
DanhBa.ghi_su_kien = _ghi_su_kien
DanhBa.nhat_ky = _nhat_ky
DanhBa.tom_tat_ngay = _tom_tat_ngay
DanhBa.duong_dan_anh_la = _duong_dan_anh_la


def _bay_gio():
    import datetime
    return datetime.datetime.now().isoformat(timespec='seconds')

def _hom_nay():
    import datetime
    return datetime.date.today().isoformat()
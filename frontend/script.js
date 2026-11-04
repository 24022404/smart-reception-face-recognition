// ===== Dùng chung cho cả 2 trang =====
const API = `http://${location.hostname || 'localhost'}:5000`;

// ===== Ngôn ngữ: Tiếng Anh / Tiếng Việt =====
// Chữ trong HTML có data-i18n="khoa" sẽ được thay theo bảng TU. Chữ do JS tạo thì gọi t('khoa').
let NGON_NGU = 'en';
const TU = {
  en: {
    camera_song: 'Camera live', mat_ket_noi: 'Disconnected', hien_ts: 'Show stats', an_ts: 'Hide stats', quan_ly: 'Manage',
    ts_he_thong: 'System', ts_model: 'Model', ts_detector: 'Detector', ts_nguong: 'Threshold',
    ts_thoi_gian: 'Processing time', ts_tim: 'Detection', ts_nhan: 'Recognition',
    ts_chat_luong: 'Face quality', cl_goc: 'Frontal pose', cl_net: 'Sharpness', cl_tp: 'Contrast',
    ts_phien: 'Session', tk_luot: 'Greetings', tk_la: 'Unknown', tk_nguoi: 'People', tk_chay: 'Uptime',
    ts_ban_do: 'Face map', ts_ung_vien: 'Nearest matches', ts_kc: 'Distance over time', nguong_chu: 'threshold', ts_nhat_ky: 'Event log',
    cg_chac: 'Match', cg_gan: 'Near threshold', cg_la: 'Unknown', cg_cho: 'Scanning',
    chao_sang: 'Good morning', chao_trua: 'Good afternoon', chao_chieu: 'Good afternoon', chao_toi: 'Good evening',
    nhan_quen: 'Recognised', nhan_la: 'Not registered', moi_dung: 'Please step in front of the camera',
    xin_chao: 'Hello', la_1: 'You are not registered yet', la_n: '{n} people are not registered yet',
    khung_la: 'UNKNOWN', khung_quet: 'SCANNING…', nguoi_la: 'Unknown',
    uv_khong_mat: 'No face in view', uv_quet: 'Scanning…', uv_trong: 'No one registered yet',
    bd_can: 'Needs at least 2 registered photos',
    nk_chao: 'Greeted {ten}', nk_gan: ' (near threshold)', nk_la: 'Unknown face detected', nk_trong: 'No events yet',

    m_overview: 'Overview', m_people: 'People', m_add: 'Add person', m_activity: 'Activity log', m_settings: 'Settings',
    sap_co: 'Soon', m_man_chao: 'Greeting screen', m_dang_xuat: 'Sign out',
    tq_them: '+ Add person', tq_nguoi: 'Registered people', tq_camera: 'Camera', tq_model: 'Recognition model', tq_chay: 'Uptime',
    tq_ds: 'People', tq_xem: 'View all →', tq_hd: 'Recent activity',
    tq_hd_sap: 'Who came in and when will appear here once the activity log is added.', tq_trong: 'No one registered yet.',
    song: 'Live', tat: 'Offline', anh_1: '{n} photo', anh_n: '{n} photos', nguong_x: 'threshold {x}', nhan_ms: 'recognition {x} ms',
    gio_phut: '{h}h {m}m', phut: '{m}m',
    tim_ph: 'Search by name', nguoi_1: '{n} person', nguoi_n: '{n} people', nen_3_5: ' · 3–5 recommended',
    them_anh: '+ Add photo', them_anh_title: 'Add a photo of {ten} from the camera', xoa_nguoi_title: 'Remove {ten}',
    xoa_anh_title: 'Delete photo {i} of {ten}', anh_alt: 'Photo {i} of {ten}', khong_xem: 'No preview',
    khong_xem_title: 'Registered before photos were saved',
    ds_trong_1: 'No one yet. Go to ', ds_trong_2: ' to register the first person.',
    cam: 'Camera', cam_goi_y: '"+ Add photo" captures the person standing in front of this camera.',
    them_phu: 'Register someone new',
    b1b: 'Stand alone', b1: ' in front of the camera, about one metre away.',
    b2b: 'Fill in the profile', b2: ' and tick the consent box.',
    b3b: 'Press Create', b3: ' to save and take the first photo.',
    loai_nv: 'Employees', loai_khach: 'Guests', tab_tat_ca: 'All', mot_nv: 'Employee', mot_khach: 'Guest',
    f_loai: 'Type', f_ma_nv: 'Employee ID', f_ho_ten: 'Full name', f_danh_xung: 'Title', f_phong_ban: 'Department',
    f_chuc_vu: 'Position', f_don_vi: 'Company', f_gap_ai: 'Visiting', f_het_han: 'Valid until', f_trang_thai: 'Status',
    f_ghi_chu: 'Notes', f_dong_y: 'This person agrees to having their face photos stored for recognition.',
    tt_dang_lam: 'Active', tt_da_nghi: 'Left', tt_het_han: 'Expired', chua_dong_y_chip: 'Consent not confirmed',
    dx_khong: '— none —', bat_buoc: 'required', vd_ma_nv: 'e.g. NV001', vd_phong_ban: 'e.g. Accounting',
    vd_don_vi: 'e.g. ABC Company', vd_gap_ai: 'Who they are here to see',
    tao_va_chup: 'Create & capture first photo', them_buoc: 'Then add 2–4 more photos from the profile page.',
    luu: 'Save changes', ve_ds: '← People', ho_so_thong_tin: 'Profile', ho_so_anh: 'Face photos',
    ho_so_gap: 'Recent visits', ho_so_gap_sap: 'Visit history will appear here once the activity log is added.',
    xoa_nguoi_nut: 'Delete this person', dang_ky_ngay: 'Registered {d}', xoa_anh_nut: 'Delete photo', dong: 'Close',
    ds_trong_loc: 'No one matches.', nv_khach: '{a} employees · {b} guests', khach: 'Guest', gap: 'visiting {ten}',
    phong_to: 'Click to enlarge', can_dong_y: 'Tick the consent box first',
    tq_da_den: 'Employees in today', tq_khach: 'Guests today', tq_la: 'Unknown faces today', tq_chua_den: 'Not in yet',
    tq_theo_gio: 'Arrivals by hour', chua_den_n: '{n} not in yet', moi_nguoi_da_den: 'Everyone is in',
    luot_n: '{n} check-ins today', la_cuoi: 'last at {g}', khong_co: 'none', hd_trong: 'No activity yet today.',
    tai_csv: 'Download CSV', hom_nay: 'Today', moi_ngay: 'All days', cot_gio: 'Time', cot_nguoi: 'Person', cot_kc: 'Distance',
    nk_dem: '{n} entries', nk_khong_co: 'No entries.', nk_la_ten: 'Unknown face', da_xoa: ' (deleted)',
    lan_gap_trong: 'No visits yet.', anh_la_alt: 'Photo of an unknown face', nk_tat_ca_ngay: 'All days',
    tao_tu_anh: 'Create from this photo', dang_ky: 'Register', dang_ky_nguoi_nay: 'Register this person', tu_anh_la: 'From the unknown-face photo taken at {g}',
    tu_anh_la_ngan: 'From an unknown-face photo', dung_camera: 'Use the camera instead', them_phu_la: 'Register an unknown visitor',
    da_dang_ky_thanh: '→ registered as {ten}', hoi_xoa_anh_la: 'Delete this unknown-face photo?', anh_la_mat: 'This photo has been deleted',
    cd_rieng_tu: 'Privacy', cd_giu_anh: 'Keep unknown-face photos',
    cd_giu_anh_mo: 'Photos of unregistered people are deleted automatically after this time. The log entry itself is kept.',
    giu_0: "Don't store photos", giu_1: '1 day', giu_n: '{n} days',
    cd_man_chao: 'Greeting screen', cd_man_chao_mo: 'Greeting texts for {nn}. Use {buoi} to insert "Good morning / afternoon / evening".',
    ten_nn_en: 'English', ten_nn_vi: 'Vietnamese',
    f_lc_nv: 'Employee greeting', f_lc_khach: 'Guest greeting', f_lc_la_tieu_de: 'Unknown face — title', f_lc_la_dong: 'Unknown face — message',
    xem_truoc: 'Preview', mac_dinh: 'Reset to default', luu_loi_chao: 'Save greetings',
    vd_ten_nv: 'Nguyễn Đức Minh', vd_phong: 'Engineering', vd_ten_khach: 'Trần Thị Hoa', vd_cty: 'ABC Company',
    cd_bao_mat: 'Security', cd_bao_mat_mo: 'Change the admin password. Other browsers signed in will be signed out.',
    mk_cu: 'Current password', mk_moi: 'New password', mk_moi2: 'Confirm new password', doi_mk: 'Change password',
    ho_ten: 'Full name', ten_ph: 'e.g. Nguyễn Đức Minh', chup: 'Capture',
    da_co: '{ten} already has {anh} — Capture adds one more.',
    sap_co_dai: 'Coming soon', hd_mo_ta: 'A list of who came in and when, filterable by day and person.',
    cd_phu: 'Appearance, privacy, greetings and security', cd_giao_dien: 'Appearance', cd_giao_dien_mo: 'How the admin area looks on this browser. The greeting screen always stays dark.',
    gd_sang: 'Light', gd_toi: 'Dark', gd_he_thong: 'System', cd_ngon_ngu: 'Language',
    cd_ngon_ngu_mo: 'Used everywhere, including the greeting screen.', cd_sap: 'Greeting text, voice and password settings are coming soon.',
    da_luu: 'Saved', doi_giao_dien: 'Switch light / dark', doi_ngon_ngu: 'Switch language',
    hoi_xoa_nguoi: 'Remove {ten} and all their photos?', hoi_xoa_anh: 'Delete this photo of {ten}?',
    nhap_ten: 'Enter a name first', mat_server: 'Cannot reach the server',

    dn_hero_1: 'Greet everyone', dn_hero_2: 'by name.', dn_hero_p: 'Face recognition that welcomes registered people the moment they walk in.',
    dn_chao: 'Welcome back', dn_mo: 'Sign in to manage registered people.', dn_mk: 'Password', dn_mk2: 'Confirm password',
    dn_nut: 'Sign in', dn_ve: '← Back to greeting screen', dn_dat: 'Set an admin password',
    dn_dat_mo: 'First time here. Choose a password (at least 6 characters) to protect the management page.',
    dn_dat_nut: 'Set password', dn_khong_khop: 'The two passwords do not match',
  },
  vi: {
    camera_song: 'Camera đang chạy', mat_ket_noi: 'Mất kết nối', hien_ts: 'Hiện thông số', an_ts: 'Ẩn thông số', quan_ly: 'Quản lý',
    ts_he_thong: 'Hệ thống', ts_model: 'Mô hình', ts_detector: 'Tìm mặt', ts_nguong: 'Ngưỡng',
    ts_thoi_gian: 'Thời gian xử lý', ts_tim: 'Tìm mặt', ts_nhan: 'Nhận diện',
    ts_chat_luong: 'Chất lượng ảnh mặt', cl_goc: 'Nhìn thẳng', cl_net: 'Độ nét', cl_tp: 'Tương phản',
    ts_phien: 'Phiên chạy', tk_luot: 'Lượt chào', tk_la: 'Người lạ', tk_nguoi: 'Số người', tk_chay: 'Đã chạy',
    ts_ban_do: 'Bản đồ khuôn mặt', ts_ung_vien: 'Ứng viên gần nhất', ts_kc: 'Khoảng cách', nguong_chu: 'ngưỡng', ts_nhat_ky: 'Nhật ký',
    cg_chac: 'Chắc chắn', cg_gan: 'Gần ngưỡng', cg_la: 'Người lạ', cg_cho: 'Đang quét',
    chao_sang: 'Chào buổi sáng', chao_trua: 'Chào buổi trưa', chao_chieu: 'Chào buổi chiều', chao_toi: 'Chào buổi tối',
    nhan_quen: 'Đã nhận diện', nhan_la: 'Chưa đăng ký', moi_dung: 'Mời bạn đứng trước camera',
    xin_chao: 'Xin chào', la_1: 'Bạn chưa có trong danh sách', la_n: '{n} người chưa có trong danh sách',
    khung_la: 'NGƯỜI LẠ', khung_quet: 'ĐANG QUÉT…', nguoi_la: 'Người lạ',
    uv_khong_mat: 'Chưa thấy khuôn mặt', uv_quet: 'Đang quét…', uv_trong: 'Chưa có ai đăng ký',
    bd_can: 'Cần ít nhất 2 ảnh đăng ký',
    nk_chao: 'Đã chào {ten}', nk_gan: ' (gần ngưỡng)', nk_la: 'Phát hiện người lạ', nk_trong: 'Chưa có sự kiện',

    m_overview: 'Tổng quan', m_people: 'Danh sách người', m_add: 'Thêm người', m_activity: 'Nhật ký', m_settings: 'Cài đặt',
    sap_co: 'Sắp có', m_man_chao: 'Màn hình chào', m_dang_xuat: 'Đăng xuất',
    tq_them: '+ Thêm người', tq_nguoi: 'Người đã đăng ký', tq_camera: 'Camera', tq_model: 'Mô hình nhận diện', tq_chay: 'Thời gian chạy',
    tq_ds: 'Danh sách người', tq_xem: 'Xem tất cả →', tq_hd: 'Hoạt động gần đây',
    tq_hd_sap: 'Ai đến lúc mấy giờ sẽ hiện ở đây khi có nhật ký.', tq_trong: 'Chưa có ai đăng ký.',
    song: 'Đang chạy', tat: 'Mất tín hiệu', anh_1: '{n} ảnh', anh_n: '{n} ảnh', nguong_x: 'ngưỡng {x}', nhan_ms: 'nhận diện {x} ms',
    gio_phut: '{h} giờ {m} phút', phut: '{m} phút',
    tim_ph: 'Tìm theo tên', nguoi_1: '{n} người', nguoi_n: '{n} người', nen_3_5: ' · nên có 3–5 ảnh',
    them_anh: '+ Thêm ảnh', them_anh_title: 'Chụp thêm ảnh cho {ten} từ camera', xoa_nguoi_title: 'Xóa {ten}',
    xoa_anh_title: 'Xóa ảnh {i} của {ten}', anh_alt: 'Ảnh {i} của {ten}', khong_xem: 'Không có ảnh',
    khong_xem_title: 'Đăng ký từ trước khi có chức năng lưu ảnh',
    ds_trong_1: 'Chưa có ai. Vào mục ', ds_trong_2: ' để đăng ký người đầu tiên.',
    cam: 'Camera', cam_goi_y: 'Nút "+ Thêm ảnh" sẽ chụp người đang đứng trước camera này.',
    them_phu: 'Đăng ký người mới',
    b1b: 'Đứng một mình', b1: ' trước camera, cách khoảng một mét.',
    b2b: 'Điền hồ sơ', b2: ' và đánh dấu ô đồng ý.',
    b3b: 'Bấm Tạo', b3: ' để lưu và chụp ảnh đầu tiên.',
    loai_nv: 'Nhân viên', loai_khach: 'Khách', tab_tat_ca: 'Tất cả', mot_nv: 'Nhân viên', mot_khach: 'Khách',
    f_loai: 'Loại', f_ma_nv: 'Mã nhân viên', f_ho_ten: 'Họ và tên', f_danh_xung: 'Danh xưng', f_phong_ban: 'Phòng ban',
    f_chuc_vu: 'Chức vụ', f_don_vi: 'Đơn vị / công ty', f_gap_ai: 'Đến gặp', f_het_han: 'Hết hạn ngày', f_trang_thai: 'Trạng thái',
    f_ghi_chu: 'Ghi chú', f_dong_y: 'Người này đồng ý cho lưu ảnh khuôn mặt để nhận diện.',
    tt_dang_lam: 'Đang làm', tt_da_nghi: 'Đã nghỉ', tt_het_han: 'Hết hạn', chua_dong_y_chip: 'Chưa xác nhận đồng ý',
    dx_khong: '— không —', bat_buoc: 'bắt buộc', vd_ma_nv: 'Ví dụ: NV001', vd_phong_ban: 'Ví dụ: Kế toán',
    vd_don_vi: 'Ví dụ: Công ty ABC', vd_gap_ai: 'Đến gặp ai',
    tao_va_chup: 'Tạo và chụp ảnh đầu tiên', them_buoc: 'Sau đó chụp thêm 2–4 ảnh ở trang hồ sơ.',
    luu: 'Lưu thay đổi', ve_ds: '← Danh sách người', ho_so_thong_tin: 'Thông tin', ho_so_anh: 'Ảnh khuôn mặt',
    ho_so_gap: 'Lần gặp gần đây', ho_so_gap_sap: 'Lịch sử ra vào sẽ hiện ở đây khi có nhật ký.',
    xoa_nguoi_nut: 'Xóa người này', dang_ky_ngay: 'Đăng ký ngày {d}', xoa_anh_nut: 'Xóa ảnh', dong: 'Đóng',
    ds_trong_loc: 'Không có ai phù hợp.', nv_khach: '{a} nhân viên · {b} khách', khach: 'Khách', gap: 'gặp {ten}',
    phong_to: 'Bấm để phóng to', can_dong_y: 'Hãy đánh dấu ô đồng ý trước',
    tq_da_den: 'Nhân viên đã đến', tq_khach: 'Khách hôm nay', tq_la: 'Người lạ hôm nay', tq_chua_den: 'Chưa đến',
    tq_theo_gio: 'Lượt đến theo giờ', chua_den_n: '{n} người chưa đến', moi_nguoi_da_den: 'Mọi người đã đến',
    luot_n: '{n} lượt hôm nay', la_cuoi: 'lần cuối {g}', khong_co: 'không có', hd_trong: 'Hôm nay chưa có hoạt động.',
    tai_csv: 'Tải CSV', hom_nay: 'Hôm nay', moi_ngay: 'Tất cả ngày', cot_gio: 'Giờ', cot_nguoi: 'Người', cot_kc: 'Khoảng cách',
    nk_dem: '{n} lượt', nk_khong_co: 'Không có lượt nào.', nk_la_ten: 'Người lạ', da_xoa: ' (đã xóa)',
    lan_gap_trong: 'Chưa có lần gặp nào.', anh_la_alt: 'Ảnh người lạ', nk_tat_ca_ngay: 'Tất cả ngày',
    tao_tu_anh: 'Tạo từ ảnh này', dang_ky: 'Đăng ký', dang_ky_nguoi_nay: 'Đăng ký người này', tu_anh_la: 'Từ ảnh người lạ chụp lúc {g}',
    tu_anh_la_ngan: 'Từ ảnh người lạ', dung_camera: 'Dùng camera thay thế', them_phu_la: 'Đăng ký người lạ',
    da_dang_ky_thanh: '→ đã đăng ký: {ten}', hoi_xoa_anh_la: 'Xóa ảnh người lạ này?', anh_la_mat: 'Ảnh này đã bị xóa',
    cd_rieng_tu: 'Quyền riêng tư', cd_giu_anh: 'Giữ ảnh người lạ',
    cd_giu_anh_mo: 'Ảnh của người chưa đăng ký sẽ tự xóa sau khoảng thời gian này. Dòng nhật ký vẫn được giữ.',
    giu_0: 'Không lưu ảnh', giu_1: '1 ngày', giu_n: '{n} ngày',
    cd_man_chao: 'Màn hình chào', cd_man_chao_mo: 'Lời chào bằng {nn}. Dùng {buoi} để chèn "Chào buổi sáng / chiều / tối".',
    ten_nn_en: 'tiếng Anh', ten_nn_vi: 'tiếng Việt',
    f_lc_nv: 'Lời chào nhân viên', f_lc_khach: 'Lời chào khách', f_lc_la_tieu_de: 'Người lạ — dòng chào', f_lc_la_dong: 'Người lạ — lời nhắn',
    xem_truoc: 'Xem trước', mac_dinh: 'Khôi phục mặc định', luu_loi_chao: 'Lưu lời chào',
    vd_ten_nv: 'Anh Minh', vd_phong: 'Phòng Kỹ thuật', vd_ten_khach: 'Chị Hoa', vd_cty: 'Công ty ABC',
    cd_bao_mat: 'Bảo mật', cd_bao_mat_mo: 'Đổi mật khẩu quản trị. Các trình duyệt khác đang đăng nhập sẽ bị đăng xuất.',
    mk_cu: 'Mật khẩu hiện tại', mk_moi: 'Mật khẩu mới', mk_moi2: 'Nhập lại mật khẩu mới', doi_mk: 'Đổi mật khẩu',
    ho_ten: 'Họ và tên', ten_ph: 'Ví dụ: Nguyễn Đức Minh', chup: 'Chụp',
    da_co: '{ten} đã có {anh} — bấm Chụp để thêm.',
    sap_co_dai: 'Sắp có', hd_mo_ta: 'Danh sách ai đến lúc mấy giờ, lọc theo ngày và theo người.',
    cd_phu: 'Giao diện, quyền riêng tư, lời chào và bảo mật', cd_giao_dien: 'Giao diện', cd_giao_dien_mo: 'Giao diện khu quản lý trên trình duyệt này. Màn hình chào luôn để tối.',
    gd_sang: 'Sáng', gd_toi: 'Tối', gd_he_thong: 'Theo máy', cd_ngon_ngu: 'Ngôn ngữ',
    cd_ngon_ngu_mo: 'Áp dụng cho toàn bộ app, kể cả màn hình chào.', cd_sap: 'Cài đặt câu chào, giọng nói và mật khẩu sẽ có sau.',
    da_luu: 'Đã lưu', doi_giao_dien: 'Đổi sáng / tối', doi_ngon_ngu: 'Đổi ngôn ngữ',
    hoi_xoa_nguoi: 'Xóa {ten} và toàn bộ ảnh của người này?', hoi_xoa_anh: 'Xóa ảnh này của {ten}?',
    nhap_ten: 'Hãy nhập tên trước', mat_server: 'Không kết nối được server',

    dn_hero_1: 'Chào từng người', dn_hero_2: 'bằng tên.', dn_hero_p: 'Nhận diện khuôn mặt và chào đúng tên ngay khi bạn bước vào.',
    dn_chao: 'Chào mừng trở lại', dn_mo: 'Đăng nhập để quản lý danh sách người.', dn_mk: 'Mật khẩu', dn_mk2: 'Nhập lại mật khẩu',
    dn_nut: 'Đăng nhập', dn_ve: '← Về màn hình chào', dn_dat: 'Đặt mật khẩu quản trị',
    dn_dat_mo: 'Lần đầu sử dụng. Hãy đặt mật khẩu (ít nhất 6 ký tự) để bảo vệ trang quản lý.',
    dn_dat_nut: 'Đặt mật khẩu', dn_khong_khop: 'Hai mật khẩu không khớp',
  },
};

function t(khoa, thay = {}) {
  let chu = TU[NGON_NGU][khoa] ?? TU.en[khoa] ?? khoa;
  for (const [k, v] of Object.entries(thay)) chu = chu.replaceAll(`{${k}}`, v);
  return chu;
}
const VUNG = () => (NGON_NGU === 'vi' ? 'vi-VN' : 'en-GB');     // định dạng ngày giờ theo ngôn ngữ

// Thay toàn bộ chữ tĩnh trong trang theo ngôn ngữ hiện tại
function dich_trang() {
  document.documentElement.lang = NGON_NGU;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); el.setAttribute('aria-label', el.title); });
}

async function nap_ngon_ngu() {
  try { NGON_NGU = (await goi_api('/api/ngon_ngu')).ngon_ngu || 'en'; } catch (e) { /* server chưa chạy: giữ tiếng Anh */ }
  dich_trang();
}

// "Chào buổi sáng / trưa / chiều / tối" theo giờ hiện tại
function buoi_hien_tai() {
  const h = new Date().getHours();
  if (h < 4) return t('chao_toi');                 // nửa đêm vẫn là buổi tối
  if (h < 11) return t('chao_sang');
  if (h < 13) return NGON_NGU === 'vi' ? t('chao_trua') : (h < 12 ? t('chao_sang') : t('chao_chieu'));
  if (h < 18) return t('chao_chieu');
  return t('chao_toi');
}

// Lời chào trên màn hình chào: {buoi} -> "Chào buổi sáng"...
let LOI_CHAO = null;
const MAU_CHAO_MAC_DINH = { nhan_vien: '{buoi}', khach: '{buoi}' };
function loi_chao_cho(loai, mau = LOI_CHAO) {
  const khoa = loai === 'khach' ? 'khach' : 'nhan_vien';
  return ((mau && mau[khoa]) || MAU_CHAO_MAC_DINH[khoa]).replaceAll('{buoi}', buoi_hien_tai());
}

async function goi_api(duong_dan, tuy_chon = {}) {
  const r = await fetch(`${API}${duong_dan}`, { credentials: 'include', ...tuy_chon });
  // Hết phiên đăng nhập khi đang ở trang quản lý -> quay về trang đăng nhập
  if (r.status === 401 && document.getElementById('ds')) {
    location.href = 'login.html';
    throw new Error('Chưa đăng nhập');
  }
  return r.json();
}

// "Nguyễn Đức Minh" -> "M" (tên gọi là chữ cuối)
function chu_dau(ten) {
  const tu = ten.trim().split(/\s+/);
  return (tu[tu.length - 1][0] || '?').toUpperCase();
}

function tao_chu_dau(ten, co) {
  const el = document.createElement('div');
  el.className = 'chu-dau';
  el.style.width = el.style.height = `${co}px`;
  el.style.fontSize = `${co * 0.42}px`;
  el.textContent = chu_dau(ten);
  return el;
}

function thong_bao(chu, loi = false) {
  let el = document.querySelector('.thong-bao');
  if (!el) { el = document.createElement('div'); el.className = 'thong-bao'; document.body.appendChild(el); }
  el.textContent = chu;
  el.classList.toggle('loi', loi);
  el.classList.add('hien');
  clearTimeout(el._hen);
  el._hen = setTimeout(() => el.classList.remove('hien'), 2500);
}

// Đèn camera: xanh khi server trả lời, đỏ khi mất kết nối
function dat_den(ok) {
  const den = document.querySelector('.den-camera');
  if (!den) return;
  den.classList.toggle('mat', !ok);
  den.textContent = ok ? t('camera_song') : t('mat_ket_noi');
}

// ===== Màn hình chào (index.html) =====
function chay_man_hinh_chao() {
  const GIU_GIAY = 4;          // người đi khỏi rồi vẫn giữ thẻ thêm 4 giây
  const SO_MAU_DO_THI = 60;    // đồ thị giữ 60 lần đo gần nhất
  const MAU = { chac: '#5BD6B4', gan: '#6CC9F5', la: '#F2B35B', cho: '#C9D1DD', xam: '#5D6779', nhat: '#8B95A7' };
  const video = document.getElementById('video');
  const khung_the = document.getElementById('cac-the');
  video.crossOrigin = 'anonymous';     // để MediaPipe được phép đọc hình
  video.src = `${API}/video_feed`;

  // ---- Đồng hồ + ngày ----
  function cap_nhat_dong_ho() {
    const now = new Date();
    document.getElementById('dong-ho').textContent =
      now.toLocaleTimeString(VUNG(), { hour: '2-digit', minute: '2-digit' });
    document.getElementById('ngay').textContent =
      now.toLocaleDateString(VUNG(), { weekday: 'long', day: 'numeric', month: 'long' });
  }
  cap_nhat_dong_ho(); setInterval(cap_nhat_dong_ho, 10000);

  // Lời chào do quản trị viên đặt trong Settings (lấy từ server); chưa tải xong thì dùng mặc định
  let ban_man_chao = '';
  goi_api('/api/man_chao').then(d => { LOI_CHAO = d.loi_chao; ban_man_chao = JSON.stringify(d); }).catch(() => {});

  // ---- Nút "Show stats" ----
  let che_do_thong_so = false;
  document.getElementById('nut-thong-so').onclick = (e) => {
    che_do_thong_so = !che_do_thong_so;
    document.body.classList.toggle('hud', che_do_thong_so);
    e.target.textContent = che_do_thong_so ? t('an_ts') : t('hien_ts');
    if (che_do_thong_so) { cap_nhat_thong_so(); tai_ban_do(); } else xoa_lop_ngam();
  };

  // ---- Thẻ chào ----
  const cac_the = {};      // khóa (tên hoặc '__la__') -> { el, lan_cuoi }

  // Tên hiện trên thẻ: tiếng Việt có danh xưng -> "Chị Lan" (tên gọi là chữ cuối), không thì họ tên đầy đủ
  function ten_chao(r) {
    if (NGON_NGU !== 'vi' || !r.danh_xung) return r.ten;
    const tu = r.ten.trim().split(/\s+/);
    return `${r.danh_xung[0].toUpperCase()}${r.danh_xung.slice(1)} ${tu[tu.length - 1]}`;
  }
  // Dòng nhỏ dưới tên: phòng ban của nhân viên, "Khách · công ty" của khách
  function dong_nhan(r) {
    if (r.loai === 'khach') return [t('khach'), r.don_vi].filter(Boolean).join(' · ');
    return r.phong_ban || t('nhan_quen');
  }

  function tao_the(khoa, loi_chao, ten, loai, nhan) {
    const el = document.createElement('div');
    el.className = `the ${loai}`;
    el.innerHTML = '<div class="loi-chao"></div><div class="ten"></div><div class="nhan"></div>';
    el.querySelector('.loi-chao').textContent = loi_chao;
    el.querySelector('.ten').textContent = ten;
    el.querySelector('.nhan').textContent = nhan || (loai === 'la' ? t('nhan_la') : t('nhan_quen'));
    khung_the.appendChild(el);
    cac_the[khoa] = { el, lan_cuoi: Date.now() };
  }

  function giu_the(khoa, bay_gio) {
    cac_the[khoa].lan_cuoi = bay_gio;
    cac_the[khoa].el.classList.remove('mo');
  }

  function hien_the_cho(co) {
    let cho = document.querySelector('.the.cho');
    if (co && !cho) {
      cho = document.createElement('div');
      cho.className = 'the cho';
      cho.innerHTML = '<div class="ten"></div>';
      cho.firstChild.textContent = t('moi_dung');
      khung_the.appendChild(cho);
    }
    if (!co && cho) cho.remove();
  }

  // ---- Ánh sáng lan từ video ----
  const may_lay_mau = document.createElement('canvas');
  may_lay_mau.width = 16; may_lay_mau.height = 12;
  const ve_mau = may_lay_mau.getContext('2d', { willReadFrequently: true });
  function cap_nhat_anh_sang() {
    try {
      if (!video.naturalWidth) return;
      ve_mau.drawImage(video, 0, 0, 16, 12);
      const px = ve_mau.getImageData(0, 0, 16, 12).data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < px.length; i += 4) { r += px[i]; g += px[i + 1]; b += px[i + 2]; }
      const n = px.length / 4;
      document.body.style.setProperty('--mau-video', `rgb(${r / n | 0}, ${g / n | 0}, ${b / n | 0})`);
    } catch (e) { /* trình duyệt không cho đọc ảnh thì bỏ qua hiệu ứng */ }
  }
  setInterval(cap_nhat_anh_sang, 500);

  // =====================================================================
  //  CHẾ ĐỘ THÔNG SỐ
  // =====================================================================
  let nguong = 0.55;

  // 4 trạng thái: đang nhận diện (mặt vừa xuất hiện), chắc chắn (xa ngưỡng), gần giống (sát ngưỡng), người lạ
  function trang_thai(r) {
    if (r.dang_cho) return 'cho';
    if (!r.ten) return 'la';
    return r.khoang_cach < nguong - 0.10 ? 'chac' : 'gan';
  }

  // Tạo phần tử SVG (dùng cho đồ thị và bản đồ)
  function svg(ten_the, thuoc_tinh = {}, chu) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', ten_the);
    for (const [k, v] of Object.entries(thuoc_tinh)) el.setAttribute(k, v);
    if (chu !== undefined) el.textContent = chu;
    return el;
  }

  // ---- Góc ngắm + 5 điểm mốc trên video ----
  const lop_ngam = document.getElementById('lop-ngam');
  const ve = lop_ngam.getContext('2d');
  function xoa_lop_ngam() { ve.clearRect(0, 0, lop_ngam.width, lop_ngam.height); }

  function ve_goc_ngam(ket_qua) {
    const W = lop_ngam.clientWidth, H = lop_ngam.clientHeight;
    const tl = window.devicePixelRatio || 1;
    lop_ngam.width = W * tl; lop_ngam.height = H * tl;
    ve.setTransform(tl, 0, 0, tl, 0, 0);
    ve.clearRect(0, 0, W, H);
    const fw = video.naturalWidth, fh = video.naturalHeight;
    if (!fw) return;
    // video hiển thị kiểu "cover" và lật ngang: đổi tọa độ khung hình -> tọa độ trên màn hình
    const k = Math.max(W / fw, H / fh), lech_x = (W - fw * k) / 2, lech_y = (H - fh * k) / 2;
    const doi_x = (x) => W - (x * k + lech_x);
    const doi_y = (y) => y * k + lech_y;
    for (const r of ket_qua) {
      const [x, y, w, h] = r.box;
      const bw = w * k, bh = h * k, bx = doi_x(x) - bw, by = doi_y(y);
      const mau = MAU[trang_thai(r)];
      const d = Math.min(bw, bh) * 0.22;
      ve.strokeStyle = mau; ve.lineWidth = 2;
      ve.beginPath();
      for (const [cx, cy, sx, sy] of [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]]) {
        ve.moveTo(cx + sx * d, cy); ve.lineTo(cx, cy); ve.lineTo(cx, cy + sy * d);
      }
      ve.stroke();
      // 5 điểm mốc: 2 mắt, mũi, 2 khóe miệng
      ve.fillStyle = mau;
      for (const [px, py] of (r.diem || [])) {
        ve.beginPath(); ve.arc(doi_x(px), doi_y(py), 2.5, 0, Math.PI * 2); ve.fill();
      }
      const nhan = r.dang_cho ? t('khung_quet')
        : `${r.ten ? r.ten + (trang_thai(r) === 'gan' ? '?' : '') : t('khung_la')}  ${r.khoang_cach.toFixed(2)}`;
      ve.font = '600 13px Inter, "Segoe UI", Arial, sans-serif';
      const rong = ve.measureText(nhan).width + 12;
      const nx = Math.max(0, Math.min(bx, W - rong));
      const ny = by - 24 >= 0 ? by - 24 : by + bh + 4;
      ve.fillStyle = 'rgba(10, 15, 26, .8)'; ve.fillRect(nx, ny, rong, 20);
      ve.fillStyle = mau; ve.fillText(nhan, nx + 6, ny + 14.5);
    }
  }

  // ---- Đồ thị đường (dùng chung cho thời gian xử lý và khoảng cách) ----
  function ve_do_thi(id, cac_duong, y_max, duong_nguong) {
    const s = document.getElementById(id);
    const W = 260, H = +s.getAttribute('viewBox').split(' ')[3];
    s.innerHTML = '';
    // điểm mới nhất luôn ở mép phải, cũ hơn lùi dần sang trái (như máy đo nhịp tim)
    const do_dai = Math.max(...cac_duong.map(d => d.diem.length), 1);
    const toa_do = (i, v) => `${(W - (do_dai - 1 - i) * W / (SO_MAU_DO_THI - 1)).toFixed(1)},${(H - Math.min(v, y_max) / y_max * H).toFixed(1)}`;
    if (duong_nguong !== undefined) {
      const y = H - duong_nguong / y_max * H;
      s.appendChild(svg('line', { x1: 0, x2: W, y1: y, y2: y, stroke: '#EEF2F7', 'stroke-dasharray': '4 4', 'stroke-width': 1, opacity: .4, 'vector-effect': 'non-scaling-stroke' }));
    }
    for (const { diem, mau } of cac_duong) {
      // vẽ từng đoạn liền nhau, chỗ không có số liệu (null) thì ngắt
      let doan = [];
      const ve_doan = () => {
        if (doan.length > 1) s.appendChild(svg('polyline', { points: doan.join(' '), fill: 'none', stroke: mau, 'stroke-width': 1.6, 'vector-effect': 'non-scaling-stroke' }));
        doan = [];
      };
      diem.forEach((v, i) => { if (v === null || v === undefined) ve_doan(); else doan.push(toa_do(i, v)); });
      ve_doan();
    }
  }

  // ---- Lịch sử số liệu cho đồ thị ----
  const ls_tim_mat = [], ls_nhan_dien = [];
  const ls_khoang_cach = [];            // mỗi phần tử: { 'Minh': 0.31, '__la__': 0.9 }
  function day_vao(mang, gia_tri) { mang.push(gia_tri); if (mang.length > SO_MAU_DO_THI) mang.shift(); }

  const BANG_MAU_DUONG = ['#5BD6B4', '#6CC9F5', '#B79CFF', '#FF9ECF', '#9BE36F'];
  function mau_duong(ten, cac_ten) {
    return ten === '__la__' ? MAU.la : BANG_MAU_DUONG[cac_ten.indexOf(ten) % BANG_MAU_DUONG.length];
  }

  // ---- Thống kê phiên ----
  const tk = { luot: 0, la: 0, nguoi: new Set() };
  function dinh_dang_thoi_gian(giay) {
    const h = Math.floor(giay / 3600), m = Math.floor(giay % 3600 / 60), s = giay % 60;
    const hai = (n) => String(n).padStart(2, '0');
    return h ? `${h}:${hai(m)}:${hai(s)}` : `${hai(m)}:${hai(s)}`;
  }

  // ---- Bảng trái: hệ thống + thời gian (hỏi server mỗi giây) ----
  async function cap_nhat_thong_so() {
    if (!che_do_thong_so) return;
    let t;
    try { t = await goi_api('/api/trang_thai'); } catch (e) { return; }
    nguong = t.nguong;
    document.getElementById('ts-model').textContent = t.model;
    document.getElementById('ts-detector').textContent = t.detector;
    document.getElementById('ts-nguong').textContent = t.nguong.toFixed(2);
    document.getElementById('ts-tim-mat').textContent = `${t.tim_mat_ms} ms`;
    document.getElementById('ts-nhan-dien').textContent = `${t.nhan_dien_ms} ms`;
    document.getElementById('tk-chay').textContent = dinh_dang_thoi_gian(t.chay_giay);
    day_vao(ls_tim_mat, t.tim_mat_ms); day_vao(ls_nhan_dien, t.nhan_dien_ms);
    const y_max = Math.max(50, ...ls_tim_mat, ...ls_nhan_dien) * 1.2;
    ve_do_thi('do-thi-ms', [{ diem: ls_tim_mat, mau: MAU.chac }, { diem: ls_nhan_dien, mau: '#7FB4FF' }], y_max);
  }
  setInterval(cap_nhat_thong_so, 1000);

  // ---- Chất lượng ảnh mặt (của khuôn mặt chính) ----
  function dat_chat_luong(id, gia_tri) {
    document.getElementById(id).textContent = gia_tri === null || gia_tri === undefined ? '–' : gia_tri.toFixed(2);
    const thanh = document.getElementById(id + '-thanh');
    const v = gia_tri || 0;
    thanh.style.width = `${v * 100}%`;
    thanh.style.background = v >= 0.6 ? MAU.chac : v >= 0.35 ? MAU.la : '#F07167';
  }

  // ---- Ứng viên gần nhất (của khuôn mặt chính) ----
  function cap_nhat_ung_vien(chinh) {
    const ul = document.getElementById('ung-vien');
    ul.innerHTML = '';
    if (!chinh || chinh.dang_cho || !chinh.ung_vien.length) {
      ul.innerHTML = `<li class="trong-ds">${!chinh ? t('uv_khong_mat') : chinh.dang_cho ? t('uv_quet') : t('uv_trong')}</li>`;
      return;
    }
    chinh.ung_vien.forEach(([ten, d], i) => {
      const li = document.createElement('li');
      li.innerHTML = '<div class="dong"><span></span><b></b></div><div class="thanh"><div class="day"></div><div class="vach"></div></div>';
      li.querySelector('span').textContent = ten;
      li.querySelector('b').textContent = d.toFixed(3);
      const day = li.querySelector('.day');
      day.style.width = `${Math.min(d, 1) * 100}%`;
      day.style.background = i === 0 && d < nguong ? MAU[trang_thai(chinh)] : MAU.xam;
      li.querySelector('.vach').style.left = `${nguong * 100}%`;
      if (i === 0) li.querySelector('span').style.color = 'var(--chu)';
      ul.appendChild(li);
    });
  }

  // ---- Dải ảnh mặt máy đang xử lý ----
  function cap_nhat_anh_mat(ket_qua) {
    const khung = document.getElementById('anh-mat');
    khung.innerHTML = '';
    for (const r of ket_qua.filter(r => r.anh).slice(0, 5)) {
      const fig = document.createElement('figure');
      fig.innerHTML = '<img alt=""><figcaption></figcaption>';
      fig.querySelector('img').src = r.anh;
      fig.querySelector('img').style.borderColor = MAU[trang_thai(r)];
      fig.querySelector('figcaption').textContent = r.ten ? r.ten + (trang_thai(r) === 'gan' ? '?' : '') : t('nguoi_la');
      khung.appendChild(fig);
    }
  }

  // ---- Bản đồ khuôn mặt ----
  let diem_dang_ky = [];                 // [{ten, x, y}] - lấy từ server mỗi 3 giây
  const vet = {};                         // khóa -> các vị trí gần đây (đã làm mượt) của khuôn mặt đang thấy
  async function tai_ban_do() {
    if (!che_do_thong_so) return;
    try { diem_dang_ky = await goi_api('/api/ban_do'); } catch (e) { /* bỏ qua */ }
  }
  setInterval(tai_ban_do, 3000);

  function ve_ban_do(ket_qua) {
    const s = document.getElementById('ban-do');
    const W = s.clientWidth || 260, H = s.clientHeight || 150, LE = 16;
    s.setAttribute('viewBox', `0 0 ${W} ${H}`);     // khớp đúng kích thước ô -> chấm tròn không bị méo
    const X = (x) => LE + x * (W - 2 * LE), Y = (y) => LE + y * (H - 2 * LE);
    s.innerHTML = '';
    if (diem_dang_ky.length === 0) {
      s.appendChild(svg('text', { x: W / 2, y: H / 2, 'text-anchor': 'middle', 'font-size': 13, fill: MAU.nhat }, t('bd_can')));
      return;
    }
    // ảnh đã đăng ký: chấm trắng mờ, tên đặt ở giữa nhóm chấm
    const nhom = {};
    for (const p of diem_dang_ky) {
      s.appendChild(svg('circle', { cx: X(p.x), cy: Y(p.y), r: 3, fill: '#EEF2F7', opacity: .45 }));
      (nhom[p.ten] = nhom[p.ten] || []).push(p);
    }
    for (const [ten, ds] of Object.entries(nhom)) {
      const cx = ds.reduce((a, p) => a + X(p.x), 0) / ds.length;
      const cy = ds.reduce((a, p) => a + Y(p.y), 0) / ds.length;
      s.appendChild(svg('text', { x: cx, y: cy - 10, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 500, fill: '#C9D1DD' }, ten));
    }
    // khuôn mặt đang thấy: vòng tròn có vệt di chuyển, vị trí được làm mượt cho khỏi nhảy
    const dang_thay = new Set();
    ket_qua.forEach((r, i) => {
      if (!r.xy) return;
      const khoa = r.ten || `la${i}`;
      dang_thay.add(khoa);
      const v = vet[khoa] || (vet[khoa] = []);
      const truoc = v[v.length - 1];
      const moi = truoc ? [truoc[0] * 0.6 + r.xy[0] * 0.4, truoc[1] * 0.6 + r.xy[1] * 0.4] : r.xy;
      v.push(moi); if (v.length > 8) v.shift();
      const mau = MAU[trang_thai(r)];
      if (v.length > 1) s.appendChild(svg('polyline', { points: v.map(p => `${X(p[0])},${Y(p[1])}`).join(' '), fill: 'none', stroke: mau, 'stroke-width': 1, 'stroke-dasharray': '2 2', opacity: .7 }));
      s.appendChild(svg('circle', { cx: X(moi[0]), cy: Y(moi[1]), r: 6, fill: 'none', stroke: mau, 'stroke-width': 1.5 }));
      s.appendChild(svg('circle', { cx: X(moi[0]), cy: Y(moi[1]), r: 2.2, fill: mau }));
    });
    for (const khoa of Object.keys(vet)) if (!dang_thay.has(khoa)) delete vet[khoa];
  }

  // ---- Nhật ký ----
  function ghi_nhat_ky(chu, loai) {
    const ol = document.getElementById('nhat-ky');
    ol.querySelector('.trong-ds')?.remove();
    const li = document.createElement('li');
    li.innerHTML = '<span class="gio"></span><span></span>';
    li.children[0].textContent = new Date().toLocaleTimeString(VUNG());
    li.children[1].textContent = chu;
    li.children[1].className = loai;
    ol.prepend(li);
    while (ol.children.length > 6) ol.lastChild.remove();
  }
  document.getElementById('nhat-ky').innerHTML = `<li class="trong-ds">${t('nk_trong')}</li>`;

  // ---- Cập nhật toàn bộ bảng thông số theo kết quả mới ----
  function cap_nhat_hud(ket_qua) {
    // khuôn mặt chính = khuôn mặt to nhất (người đứng gần nhất)
    const chinh = ket_qua.reduce((a, r) => (!a || r.box[2] * r.box[3] > a.box[2] * a.box[3] ? r : a), null);
    cap_nhat_anh_mat(ket_qua);
    cap_nhat_ung_vien(chinh);
    ve_ban_do(ket_qua);
    const cl = (chinh && chinh.chat_luong) || {};
    dat_chat_luong('cl-goc', cl.goc_mat); dat_chat_luong('cl-net', cl.do_net); dat_chat_luong('cl-tp', cl.tuong_phan);

    const mau_kc = {};
    for (const r of ket_qua.filter(r => !r.dang_cho)) {
      const khoa = r.ten || '__la__';
      mau_kc[khoa] = Math.min(mau_kc[khoa] ?? 9, r.khoang_cach);
    }
    day_vao(ls_khoang_cach, mau_kc);
    const cac_ten = [...new Set(ls_khoang_cach.flatMap(o => Object.keys(o)))].sort();
    ve_do_thi('do-thi-kc',
      cac_ten.map(ten => ({ diem: ls_khoang_cach.map(o => o[ten] ?? null), mau: mau_duong(ten, cac_ten) })),
      1.2, nguong);
  }

  // =====================================================================
  //  BÁM MẶT NGAY TRONG TRÌNH DUYỆT (MediaPipe của Google)
  //  Trình duyệt tìm vị trí mặt trên từng khung hình (~30 lần/giây) và tự vẽ khung,
  //  rồi gửi vị trí lên server (5 lần/giây). Server chỉ còn việc nhận ra TÊN.
  //  Nếu không nạp được MediaPipe (không có mạng...) thì server tự bám mặt như trước.
  // =====================================================================
  // Ưu tiên bản có sẵn trong máy (thư mục thu_vien) -> chạy được khi không có mạng.
  // Thiếu file thì mới tải từ mạng.
  const NGUON_MP = [
    { thu_vien: '/thu_vien/mediapipe', mo_hinh: '/thu_vien/mediapipe/blaze_face_short_range.tflite' },
    { thu_vien: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21',
      mo_hinh: 'https://storage.googleapis.com/mediapipe-models/face_detector/' +
               'blaze_face_short_range/float16/1/blaze_face_short_range.tflite' },
  ];
  let bo_tim = null;                     // bộ tìm mặt MediaPipe (null = chưa có)
  let mat_tb = [], vua_mat_tb = [];      // mặt trình duyệt đang thấy / vừa mất (giữ 1 giây)
  let so_id_tb = 0;
  let tt_server = {};                    // id -> tên, khoảng cách... server trả về
  let tim_mat_ms_tb = 0, lan_gui = 0, lan_tim = 0, t_cuoi = 0;

  // Đo thời gian trung bình của 1 lần tìm mặt
  function do_toc_do(bt) {
    let t = performance.now(), tong = 0;
    for (let i = 0; i < 8; i++) {
      t_cuoi = Math.max(t_cuoi + 1, performance.now());
      const a = performance.now(); bt.detectForVideo(video, t_cuoi); tong += performance.now() - a;
    }
    return tong / 8;
  }

  async function nap_mediapipe() {
    try {
      let mp = null, nguon = null;
      for (const n of NGUON_MP) {
        try { mp = await import(`${n.thu_vien}/vision_bundle.mjs`); nguon = n; break; }
        catch (e) { console.warn('Không nạp được MediaPipe từ', n.thu_vien); }
      }
      if (!mp) throw new Error('không có MediaPipe');
      const { FaceDetector, FilesetResolver } = mp;
      const tep = await FilesetResolver.forVisionTasks(`${nguon.thu_vien}/wasm`);
      console.log('MediaPipe lấy từ', nguon.thu_vien);
      while (!video.naturalWidth) await new Promise(r => setTimeout(r, 200));     // chờ có hình
      let tot = null, ms_tot = Infinity, ten_tot = '';
      // Thử card đồ họa (GPU) trước, rồi CPU; giữ cái nào nhanh hơn
      for (const delegate of ['GPU', 'CPU']) {
        try {
          const bt = await FaceDetector.createFromOptions(tep, {
            baseOptions: { modelAssetPath: nguon.mo_hinh, delegate },
            runningMode: 'VIDEO', minDetectionConfidence: 0.6,
          });
          const ms = do_toc_do(bt);
          console.log(`MediaPipe ${delegate}: ${ms.toFixed(1)} ms/lần`);
          if (ms < ms_tot) { if (tot) tot.close(); tot = bt; ms_tot = ms; ten_tot = delegate; } else bt.close();
          if (delegate === 'GPU' && ms < 15) break;          // GPU đủ nhanh rồi, khỏi thử CPU
        } catch (e) { console.warn(`MediaPipe ${delegate} không chạy được:`, e); }
      }
      if (tot) { bo_tim = tot; console.log(`Bám mặt bằng MediaPipe (${ten_tot})`); requestAnimationFrame(vong_lap_bam); }
    } catch (e) {
      console.warn('Không nạp được MediaPipe -> server tự bám mặt như cũ', e);
    }
  }

  // Giữ id cho từng mặt: mặt mới ở gần chỗ mặt cũ -> cùng một người (cùng tên)
  function gan_id(cac_hop) {
    const bay_gio = performance.now();
    const cu = [...mat_tb, ...vua_mat_tb];
    const moi = cac_hop.map(h => {
      const [x, y, w, h_] = h.box;
      let tot = null, kc_tot = Math.max(w, h_) * 0.8;
      for (const m of cu) {
        const [mx, my, mw, mh] = m.box;
        const kc = Math.hypot(x + w / 2 - mx - mw / 2, y + h_ / 2 - my - mh / 2);
        if (kc < kc_tot) { tot = m; kc_tot = kc; }
      }
      if (tot) cu.splice(cu.indexOf(tot), 1);
      return { id: tot ? tot.id : ++so_id_tb, box: h.box, diem: h.diem };
    });
    const ids = new Set(moi.map(m => m.id));
    vua_mat_tb = [...vua_mat_tb.filter(m => !ids.has(m.id) && bay_gio - m.luc_mat < 1000),
                  ...mat_tb.filter(m => !ids.has(m.id)).map(m => ({ ...m, luc_mat: bay_gio }))];
    mat_tb = moi;
  }

  // Ghép vị trí mới nhất (trình duyệt) với tên (server)
  function ket_qua_ve() {
    return mat_tb.map(m => ({ ...(tt_server[`b${m.id}`] || { ten: null, dang_cho: true }), box: m.box, diem: m.diem }));
  }

  async function gui_vi_tri() {
    try {
      const kq = await goi_api('/api/mat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mat: mat_tb.map(m => ({ id: m.id, box: m.box, diem: m.diem })), ms: tim_mat_ms_tb }),
      });
      tt_server = Object.fromEntries(kq.map(r => [r.id, r]));
    } catch (e) { /* server bận/mất kết nối: lần sau gửi lại */ }
  }

  function vong_lap_bam() {
    requestAnimationFrame(vong_lap_bam);
    const bay_gio = performance.now();
    if (!video.naturalWidth || bay_gio - lan_tim < 30) return;      // tối đa ~30 lần/giây
    lan_tim = bay_gio;
    let kq;
    try {
      t_cuoi = Math.max(t_cuoi + 1, bay_gio);
      kq = bo_tim.detectForVideo(video, t_cuoi);
    } catch (e) { return; }
    tim_mat_ms_tb = tim_mat_ms_tb * 0.9 + (performance.now() - bay_gio) * 0.1;
    const W = video.naturalWidth, H = video.naturalHeight;
    gan_id(kq.detections.map(d => {
      const b = d.boundingBox;
      const x = Math.max(0, Math.round(b.originX)), y = Math.max(0, Math.round(b.originY));
      return {
        box: [x, y, Math.min(Math.round(b.width), W - x), Math.min(Math.round(b.height), H - y)],
        diem: d.keypoints.slice(0, 4).map(k => [Math.round(k.x * W), Math.round(k.y * H)]),   // 2 mắt, mũi, miệng
      };
    }));
    if (che_do_thong_so) ve_goc_ngam(ket_qua_ve());
    if (bay_gio - lan_gui > 200) { lan_gui = bay_gio; gui_vi_tri(); }
  }
  nap_mediapipe();

  // =====================================================================
  //  Vòng lặp chính: hỏi server ai đang đứng trước camera
  // =====================================================================
  // Hỏi 10 lần/giây để khung bám sát mặt; thẻ chào và các bảng thì 0.5 giây cập nhật 1 lần
  let dang_hoi = false, dem = 0;
  async function cap_nhat() {
    if (dang_hoi) return;
    dang_hoi = true;
    let ket_qua;
    try { ket_qua = await goi_api('/api/nhan_dien'); dat_den(true); }
    catch (e) { dat_den(false); return; }
    finally { dang_hoi = false; }
    if (che_do_thong_so && !bo_tim) ve_goc_ngam(ket_qua);   // có MediaPipe thì vòng lặp bên dưới tự vẽ
    if (dem++ % 5) return;
    const bay_gio = Date.now();

    for (const r of ket_qua.filter(r => r.ten)) {
      const khoa = `p${r.id_nguoi}`;                 // theo mã người (2 người trùng tên vẫn là 2 thẻ)
      if (cac_the[khoa]) giu_the(khoa, bay_gio);
      else {
        tao_the(khoa, loi_chao_cho(r.loai), ten_chao(r), 'quen', dong_nhan(r));
        tk.luot++; tk.nguoi.add(r.id_nguoi);
        const gan = trang_thai(r) === 'gan';
        ghi_nhat_ky(`${t('nk_chao', { ten: r.ten })}${gan ? t('nk_gan') : ''} · ${r.khoang_cach.toFixed(2)}`, gan ? 'gan' : 'quen');
      }
    }

    const so_la = ket_qua.filter(r => !r.ten && !r.dang_cho).length;
    if (so_la) {
      const dong2 = so_la > 1 ? t('la_n', { n: so_la }) : ((LOI_CHAO && LOI_CHAO.la_dong) || t('la_1'));
      if (cac_the.__la__) { giu_the('__la__', bay_gio); cac_the.__la__.el.querySelector('.ten').textContent = dong2; }
      else { tao_the('__la__', (LOI_CHAO && LOI_CHAO.la_tieu_de) || t('xin_chao'), dong2, 'la'); tk.la++; ghi_nhat_ky(t('nk_la'), 'la'); }
    }

    for (const [khoa, t] of Object.entries(cac_the)) {
      if (bay_gio - t.lan_cuoi > GIU_GIAY * 1000 && !t.el.classList.contains('mo')) {
        t.el.classList.add('mo');
        setTimeout(() => {
          if (t.el.classList.contains('mo')) { t.el.remove(); delete cac_the[khoa]; }
        }, 500);
      }
    }
    hien_the_cho(Object.keys(cac_the).length === 0);

    document.getElementById('tk-luot').textContent = tk.luot;
    document.getElementById('tk-la').textContent = tk.la;
    document.getElementById('tk-nguoi').textContent = tk.nguoi.size;
    if (che_do_thong_so) cap_nhat_hud(ket_qua);
  }
  hien_the_cho(true);
  setInterval(cap_nhat, 100);

  // Quản trị viên đổi ngôn ngữ hoặc lời chào trong Settings -> màn hình chào tự tải lại
  setInterval(async () => {
    try {
      const d = await goi_api('/api/man_chao');
      if (d.ngon_ngu !== NGON_NGU || (ban_man_chao && JSON.stringify(d) !== ban_man_chao)) location.reload();
    } catch (e) { /* bỏ qua */ }
  }, 5000);
}

// ===== Khu quản lý (admin.html) =====
function chay_trang_quan_ly() {
  let ds = [];                 // danh sách người (hồ sơ + ảnh) lấy từ server
  let trang_hien = '', id_ho_so = null, loc_loai = '', them_tu_la = null;
  const gio_anh_la = {};               // mã ảnh người lạ -> lúc chụp (để ghi chú khi đăng ký)
  const DANH_XUNG = ['', 'anh', 'chị', 'cô', 'thầy', 'bạn', 'ông', 'bà'];
  const ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const ICON_TOI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  const $ = (id) => document.getElementById(id);
  const tim_nguoi = (id) => ds.find(n => n.id === id);
  const so_anh_chu = (n) => t(n === 1 ? 'anh_1' : 'anh_n', { n });
  const ngay_ngan = (iso) => (iso ? new Date(iso).toLocaleDateString(VUNG(), { day: 'numeric', month: 'short', year: 'numeric' }) : '');
  const hoa_dau = (chu) => chu ? chu[0].toUpperCase() + chu.slice(1) : '';

  function ngay_hom_nay() {
    $('ngay-hom-nay').textContent = new Date().toLocaleDateString(VUNG(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  ngay_hom_nay();

  // ---- Chuyển trang theo menu: #overview, #people, #add, #person/12, #activity, #settings ----
  // Chỉ trang đang mở mới bật camera, để không mở nhiều luồng video cùng lúc
  function mo_trang() {
    const [ten, so, ma] = (location.hash || '#overview').slice(1).split('/');
    let trang = document.querySelector(`.trang[data-trang="${ten}"]`) ? ten : 'overview';
    id_ho_so = trang === 'person' ? Number(so) : null;
    them_tu_la = trang === 'add' && so === 'la' && ma ? ma : null;     // đăng ký từ ảnh người lạ
    if (trang === 'person' && !tim_nguoi(id_ho_so) && ds.length) trang = 'people';   // người không tồn tại
    trang_hien = trang;
    document.querySelectorAll('.trang').forEach(el => { el.hidden = el.dataset.trang !== trang; });
    const menu = trang === 'person' ? 'people' : trang;            // đang xem hồ sơ thì sáng mục "People"
    document.querySelectorAll('.menu a[data-trang]').forEach(el => el.classList.toggle('dang-mo', el.dataset.trang === menu));
    document.querySelectorAll('img[data-video]').forEach(img => {
      const can = img.closest('.trang').dataset.trang === trang;
      if (can && !img.getAttribute('src')) img.src = `${API}/video_feed?khung=1`;
      if (!can && img.getAttribute('src')) img.removeAttribute('src');      // tắt luồng video của trang đang ẩn
    });
    if (trang === 'add') ve_che_do_them();
    if (trang === 'overview') cap_nhat_tong_quan();
    if (trang === 'person') ve_ho_so();
    if (trang === 'activity') tai_nhat_ky();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', mo_trang);

  function hieu_ung_chup() {
    const chop = document.querySelector(`.trang[data-trang="${trang_hien}"] .chop`);
    if (chop) { chop.classList.remove('no'); void chop.offsetWidth; chop.classList.add('no'); }
  }

  // ---- Ảnh đại diện: ảnh đầu tiên có hình, không có thì chữ cái đầu ----
  function anh_dai_dien(n, co) {
    const dau = n.anh.find(a => a.co_anh);
    if (!dau) return tao_chu_dau(n.ho_ten, co);
    const img = document.createElement('img');
    img.className = 'dai-dien'; img.alt = ''; img.src = `${API}/api/anh/${dau.ma}`;
    img.style.width = img.style.height = `${co}px`;
    return img;
  }

  // ---- Các nhãn nhỏ: loại, trạng thái, đồng ý ----
  function cac_chip(n) {
    const chip = [];
    chip.push([n.loai === 'khach' ? 'khach' : 'nv', n.loai === 'khach' ? t('mot_khach') : t('mot_nv')]);
    if (n.loai === 'nhan_vien' && n.trang_thai === 'da_nghi') chip.push(['xam', t('tt_da_nghi')]);
    else if (n.loai === 'khach' && !n.con_hieu_luc) chip.push(['xam', t('tt_het_han')]);
    if (!n.dong_y) chip.push(['canh-bao', t('chua_dong_y_chip')]);
    const khung = document.createElement('span');
    khung.className = 'cac-chip';
    for (const [lop, chu] of chip) {
      const el = document.createElement('span'); el.className = `chip ${lop}`; el.textContent = chu; khung.appendChild(el);
    }
    return khung;
  }

  // Dòng phụ dưới tên: "NV001 · Kế toán" hoặc "Công ty ABC · gặp chị Lan"
  function dong_phu(n) {
    const phan = n.loai === 'khach' ? [n.don_vi, n.gap_ai && t('gap', { ten: n.gap_ai })] : [n.ma_nv, n.phong_ban, n.chuc_vu];
    return phan.filter(Boolean).join(' · ');
  }

  // =====================================================================
  //  FORM HỒ SƠ (dùng chung cho trang "Add person" và trang hồ sơ)
  // =====================================================================
  function ve_form(khung, co_trang_thai) {
    const o = (ten, nhan, kieu = 'text', goi_y = '', bat_buoc = false, cho = '') => `
      <label class="o-truong" ${cho ? `data-cho="${cho}"` : ''}>
        <span class="nhan-o">${t(nhan)}${bat_buoc ? ` <em>*</em>` : ''}</span>
        <input class="o-chu" name="${ten}" type="${kieu}" ${goi_y ? `placeholder="${t(goi_y)}"` : ''}>
      </label>`;
    khung.innerHTML = `
      <div class="o-truong rong">
        <span class="nhan-o">${t('f_loai')}</span>
        <div class="chon-doan" data-chon-loai>
          <button type="button" data-loai="nhan_vien">${t('mot_nv')}</button>
          <button type="button" data-loai="khach">${t('mot_khach')}</button>
        </div>
      </div>
      ${o('ma_nv', 'f_ma_nv', 'text', 'vd_ma_nv', true, 'nhan_vien')}
      ${o('ho_ten', 'f_ho_ten', 'text', 'ten_ph', true)}
      <label class="o-truong">
        <span class="nhan-o">${t('f_danh_xung')}</span>
        <select class="o-chu" name="danh_xung">${DANH_XUNG.map(d => `<option value="${d}">${d ? hoa_dau(d) : t('dx_khong')}</option>`).join('')}</select>
      </label>
      ${o('phong_ban', 'f_phong_ban', 'text', 'vd_phong_ban', false, 'nhan_vien')}
      ${o('chuc_vu', 'f_chuc_vu', 'text', '', false, 'nhan_vien')}
      ${co_trang_thai ? `<label class="o-truong" data-cho="nhan_vien">
        <span class="nhan-o">${t('f_trang_thai')}</span>
        <select class="o-chu" name="trang_thai"><option value="dang_lam">${t('tt_dang_lam')}</option><option value="da_nghi">${t('tt_da_nghi')}</option></select>
      </label>` : ''}
      ${o('don_vi', 'f_don_vi', 'text', 'vd_don_vi', false, 'khach')}
      ${o('gap_ai', 'f_gap_ai', 'text', 'vd_gap_ai', false, 'khach')}
      ${o('het_han', 'f_het_han', 'date', '', false, 'khach')}
      <label class="o-truong rong"><span class="nhan-o">${t('f_ghi_chu')}</span><textarea class="o-chu" name="ghi_chu" rows="2"></textarea></label>
      <label class="o-dong-y rong"><input type="checkbox" name="dong_y"><span>${t('f_dong_y')}</span></label>`;
    khung.querySelectorAll('[data-loai]').forEach(nut => { nut.onclick = () => chon_loai(khung, nut.dataset.loai); });
  }

  function chon_loai(khung, loai) {
    khung.dataset.loai = loai;
    khung.querySelectorAll('[data-loai]').forEach(n => n.setAttribute('aria-checked', n.dataset.loai === loai));
    khung.querySelectorAll('[data-cho]').forEach(el => { el.hidden = el.dataset.cho !== loai; });   // chỉ hiện ô của loại này
  }

  function dat_form(khung, n) {
    for (const el of khung.querySelectorAll('[name]')) {
      if (el.type === 'checkbox') el.checked = !!n[el.name];
      else el.value = n[el.name] ?? '';
    }
    chon_loai(khung, n.loai || 'nhan_vien');
  }

  function lay_form(khung) {
    const kq = { loai: khung.dataset.loai || 'nhan_vien' };
    for (const el of khung.querySelectorAll('[name]')) kq[el.name] = el.type === 'checkbox' ? el.checked : el.value.trim();
    return kq;
  }

  // =====================================================================
  //  TRANG PEOPLE: danh sách có lọc theo loại + tìm kiếm
  // =====================================================================
  function ve_danh_sach() {
    const ul = $('ds');
    const so_nv = ds.filter(n => n.loai === 'nhan_vien').length;
    $('so-nguoi').textContent = `${t('nv_khach', { a: so_nv, b: ds.length - so_nv })} · ${so_anh_chu(ds.reduce((x, n) => x + n.anh.length, 0))}`;
    ul.innerHTML = '';
    if (!ds.length) {
      ul.innerHTML = '<li class="trong"><span></span><a class="lien-ket" href="#add"></a><span></span></li>';
      const [c1, lk, c2] = ul.querySelector('.trong').children;
      c1.textContent = t('ds_trong_1'); lk.textContent = t('m_add'); c2.textContent = t('ds_trong_2');
      return;
    }
    const q = $('tim').value.trim().toLowerCase();
    const hien = ds.filter(n => (!loc_loai || n.loai === loc_loai) &&
      (!q || [n.ho_ten, n.ma_nv, n.phong_ban, n.don_vi].some(x => (x || '').toLowerCase().includes(q))));
    if (!hien.length) { ul.innerHTML = `<li class="trong">${t('ds_trong_loc')}</li>`; return; }
    for (const n of hien) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'hang-nguoi'; a.href = `#person/${n.id}`;
      if (!n.con_hieu_luc) a.classList.add('mo');
      a.appendChild(anh_dai_dien(n, 40));
      const giua = document.createElement('span');
      giua.className = 'giua';
      giua.innerHTML = '<span class="ten"></span><span class="phu"></span>';
      giua.children[0].textContent = n.ho_ten;
      giua.children[1].textContent = dong_phu(n);
      a.appendChild(giua);
      a.appendChild(cac_chip(n));
      const so = document.createElement('span');
      so.className = 'so-anh'; so.textContent = so_anh_chu(n.anh.length);
      a.appendChild(so);
      a.insertAdjacentHTML('beforeend', `<span class="mui-ten">${ICON_TOI}</span>`);
      li.appendChild(a);
      ul.appendChild(li);
    }
  }
  $('tim').addEventListener('input', ve_danh_sach);
  document.querySelectorAll('#loc-loai [data-loc]').forEach(nut => {
    nut.onclick = () => {
      loc_loai = nut.dataset.loc;
      document.querySelectorAll('#loc-loai [data-loc]').forEach(x => x.setAttribute('aria-checked', x === nut));
      ve_danh_sach();
    };
  });

  // =====================================================================
  //  TRANG ADD PERSON: điền hồ sơ -> tạo + chụp ảnh đầu tiên
  // =====================================================================
  const khung_them = $('o-form-them');
  function ve_form_them() {
    const cu = khung_them.dataset.loai ? lay_form(khung_them) : { loai: 'nhan_vien' };
    ve_form(khung_them, false);
    dat_form(khung_them, cu);
  }
  function ve_che_do_them() {
    const tu_la = !!them_tu_la;
    $('them-camera').hidden = tu_la;
    $('them-tu-la').hidden = !tu_la;
    $('them-phu').textContent = tu_la ? t('them_phu_la') : t('them_phu');
    $('nut-tao').textContent = tu_la ? t('tao_tu_anh') : t('tao_va_chup');
    if (tu_la) {
      const img = $('them-camera').querySelector('img');
      if (img.getAttribute('src')) img.removeAttribute('src');          // không cần camera
      $('them-anh-la').src = `${API}/api/anh_la/${them_tu_la}`;
      $('them-anh-la').onerror = () => { $('them-la-chu').textContent = t('anh_la_mat'); };
      const g = gio_anh_la[them_tu_la];
      $('them-la-chu').textContent = g ? t('tu_anh_la', { g }) : t('tu_anh_la_ngan');
      if (!lay_form(khung_them).ho_ten) chon_loai(khung_them, 'khach');   // người lạ thường là khách
    }
  }

  $('form-them').onsubmit = async (e) => {
    e.preventDefault();
    const info = lay_form(khung_them);
    if (them_tu_la) info.tu_anh_la = them_tu_la;
    if (!info.dong_y) { thong_bao(t('can_dong_y'), true); return; }
    $('nut-tao').disabled = true;
    if (!them_tu_la) hieu_ung_chup();
    try {
      const r = await goi_api('/api/nguoi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(info) });
      thong_bao(r.thong_bao, !r.ok);
      if (r.ok) {
        ve_form(khung_them, false); dat_form(khung_them, { loai: info.loai });    // xóa trắng form
        await tai_danh_sach();
        location.hash = `#person/${r.id}`;                                           // sang hồ sơ để chụp thêm ảnh
      }
    } catch (e) { thong_bao(t('mat_server'), true); }
    $('nut-tao').disabled = false;
  };

  // =====================================================================
  //  TRANG HỒ SƠ 1 NGƯỜI
  // =====================================================================
  const khung_hs = $('o-form-ho-so');
  function ve_ho_so() {
    const n = tim_nguoi(id_ho_so);
    if (!n) return;
    const dd = $('hs-dai-dien'); dd.innerHTML = ''; dd.appendChild(anh_dai_dien(n, 72));
    $('hs-ten').textContent = n.ho_ten;
    const chip = $('hs-chip'); chip.replaceWith(Object.assign(cac_chip(n), { id: 'hs-chip' }));
    $('hs-ngay').textContent = [dong_phu(n), t('dang_ky_ngay', { d: ngay_ngan(n.ngay_tao) })].filter(Boolean).join(' · ');
    ve_form(khung_hs, true);
    dat_form(khung_hs, n);
    ve_anh_ho_so(n);
    tai_lan_gap(n.id);
  }

  async function tai_lan_gap(id) {
    let hang;
    try { hang = await goi_api(`/api/nhat_ky?nguoi=${id}&gioi_han=10`); } catch (e) { return; }
    if (id !== id_ho_so) return;                       // đã chuyển sang người khác trong lúc chờ
    const ul = $('hs-lan-gap');
    ul.innerHTML = hang.length ? '' : `<li class="trong">${t('lan_gap_trong')}</li>`;
    for (const r of hang) {
      const li = document.createElement('li');
      li.innerHTML = '<span></span><b></b>';
      li.children[0].textContent = new Date(r.thoi_gian).toLocaleDateString(VUNG(), { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' });
      li.children[1].textContent = r.thoi_gian.slice(11, 16);
      ul.appendChild(li);
    }
  }

  function ve_anh_ho_so(n) {
    $('hs-so-anh').textContent = so_anh_chu(n.anh.length) + (n.anh.length < 3 ? t('nen_3_5') : '');
    const luoi = $('hs-anh'); luoi.innerHTML = '';
    n.anh.forEach((a, i) => {
      const o = document.createElement('figure');
      o.className = 'o-anh';
      if (a.co_anh) {
        const img = document.createElement('img');
        img.alt = t('anh_alt', { i: i + 1, ten: n.ho_ten }); img.src = `${API}/api/anh/${a.ma}`; img.loading = 'lazy';
        img.title = t('phong_to');
        img.onclick = () => phong_to(n, a.ma);
        o.appendChild(img);
      } else {
        o.classList.add('khong-anh');
        o.innerHTML = '<span></span>'; o.firstChild.textContent = t('khong_xem'); o.title = t('khong_xem_title');
      }
      o.appendChild(tao_nut('xoa-anh', ICON_X, t('xoa_anh_title', { i: i + 1, ten: n.ho_ten }), () => xoa_anh(n, a.ma)));
      luoi.appendChild(o);
    });
  }

  $('form-ho-so').onsubmit = async (e) => {
    e.preventDefault();
    $('nut-luu').disabled = true;
    try {
      const r = await goi_api(`/api/nguoi/${id_ho_so}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lay_form(khung_hs)) });
      thong_bao(r.thong_bao, !r.ok);
      if (r.ok) { await tai_danh_sach(); ve_ho_so(); }
    } catch (e) { thong_bao(t('mat_server'), true); }
    $('nut-luu').disabled = false;
  };

  $('nut-them-anh').onclick = async () => {
    const nut = $('nut-them-anh');
    nut.disabled = true; hieu_ung_chup();
    try {
      const r = await goi_api(`/api/nguoi/${id_ho_so}/anh`, { method: 'POST' });
      thong_bao(r.thong_bao, !r.ok);
      if (r.ok) { await tai_danh_sach(); ve_ho_so(); }
    } catch (e) { thong_bao(t('mat_server'), true); }
    nut.disabled = false;
  };

  $('nut-xoa-nguoi').onclick = async () => {
    const n = tim_nguoi(id_ho_so);
    if (!n || !confirm(t('hoi_xoa_nguoi', { ten: n.ho_ten }))) return;
    const r = await goi_api(`/api/nguoi/${n.id}`, { method: 'DELETE' });
    thong_bao(r.thong_bao, !r.ok);
    await tai_danh_sach();
    location.hash = '#people';
  };

  async function xoa_anh(n, ma) {
    if (!confirm(t('hoi_xoa_anh', { ten: n.ho_ten }))) return false;
    const r = await goi_api(`/api/anh/${ma}`, { method: 'DELETE' });
    thong_bao(r.thong_bao, !r.ok);
    await tai_danh_sach();
    if (tim_nguoi(n.id)) ve_ho_so(); else location.hash = '#people';     // xóa hết ảnh thì người đó vẫn còn hồ sơ
    return true;
  }

  // ---- Phóng to 1 ảnh (ảnh đăng ký có thêm nút Xóa; ảnh người lạ chỉ xem) ----
  function hop_anh(src, chu, khi_xoa, khi_dang_ky) {
    const nen = document.createElement('div');
    nen.className = 'phong-to';
    nen.innerHTML = `<figure><img alt=""><figcaption><span></span>
      ${khi_dang_ky ? '<button class="nut nut-chinh nut-nho-gon" data-dang-ky></button>' : ''}
      ${khi_xoa ? '<button class="nut nut-nguy-hiem nut-nho-gon" data-xoa></button>' : ''}<button class="nut nut-nho-gon" data-dong></button></figcaption></figure>`;
    nen.querySelector('img').src = src;
    nen.querySelector('figcaption span').textContent = chu;
    const nut_dong = nen.querySelector('[data-dong]'), nut_xoa = nen.querySelector('[data-xoa]');
    nut_dong.textContent = t('dong');
    const dong = () => { nen.remove(); document.removeEventListener('keydown', phim); };
    const phim = (e) => { if (e.key === 'Escape') dong(); };
    nen.onclick = (e) => { if (e.target === nen) dong(); };
    nut_dong.onclick = dong;
    if (nut_xoa) { nut_xoa.textContent = t('xoa_anh_nut'); nut_xoa.onclick = async () => { if (await khi_xoa()) dong(); }; }
    const nut_dk = nen.querySelector('[data-dang-ky]');
    if (nut_dk) { nut_dk.textContent = t('dang_ky_nguoi_nay'); nut_dk.onclick = () => { dong(); khi_dang_ky(); }; }
    document.addEventListener('keydown', phim);
    document.body.appendChild(nen);
    nut_dong.focus();
  }
  const phong_to = (n, ma) => hop_anh(`${API}/api/anh/${ma}`, n.ho_ten, () => xoa_anh(n, ma));

  function tao_nut(lop, noi_dung, nhan, bam) {
    const nut = document.createElement('button');
    nut.type = 'button'; nut.className = lop; nut.innerHTML = noi_dung; nut.setAttribute('aria-label', nhan); nut.title = nhan;
    nut.onclick = bam;
    return nut;
  }

  // =====================================================================
  //  1 DÒNG SỰ KIỆN (dùng ở Overview và trang Nhật ký)
  // =====================================================================
  const hom_nay_iso = () => new Date().toLocaleDateString('sv-SE');          // dạng 2026-11-04
  function loai_su_kien(r) { return r.loai === 'la' ? 'la' : r.loai_nguoi; }

  function chip_loai(r) {
    const loai = loai_su_kien(r);
    const el = document.createElement('span');
    el.className = `chip ${loai === 'la' ? 'la' : loai === 'khach' ? 'khach' : 'nv'}`;
    el.textContent = loai === 'la' ? t('tk_la') : loai === 'khach' ? t('mot_khach') : t('mot_nv');
    return el;
  }

  // Ô người: ảnh (ảnh đăng ký / ảnh chụp người lạ / chữ cái đầu) + tên + dòng phụ
  function o_nguoi_su_kien(r) {
    const o = document.createElement(r.nguoi_id && r.con_ho_so ? 'a' : 'span');
    o.className = 'o-nguoi-sk';
    if (o.tagName === 'A') o.href = `#person/${r.nguoi_id}`;
    let anh;
    if (r.loai === 'la' && r.ma_anh) {
      anh = document.createElement('img');
      anh.className = 'anh-la'; anh.alt = t('anh_la_alt'); anh.src = `${API}/api/anh_la/${r.ma_anh}`;
      anh.title = t('phong_to');
      gio_anh_la[r.ma_anh] = r.thoi_gian.replace('T', ' ').slice(0, 16);
      anh.onclick = (e) => {
        e.preventDefault();
        hop_anh(anh.src, `${t('nk_la_ten')} · ${gio_anh_la[r.ma_anh]}`, () => xoa_anh_la(r.ma_anh),
                r.nguoi_id ? null : () => { location.hash = `#add/la/${r.ma_anh}`; });
      };
    } else if (r.anh_dai_dien) {
      anh = document.createElement('img');
      anh.className = 'dai-dien'; anh.alt = ''; anh.src = `${API}/api/anh/${r.anh_dai_dien}`; anh.style.width = anh.style.height = '34px';
    } else anh = tao_chu_dau(r.ho_ten || '?', 34);
    o.appendChild(anh);
    const chu = document.createElement('span');
    chu.className = 'giua';
    chu.innerHTML = '<span class="ten"></span><span class="phu"></span>';
    chu.children[0].textContent = r.loai === 'la' ? t('nk_la_ten') : r.ho_ten + (r.con_ho_so ? '' : t('da_xoa'));
    chu.children[1].textContent = r.loai === 'la' ? (r.nguoi_id ? t('da_dang_ky_thanh', { ten: r.ho_ten }) : '')
      : (r.loai_nguoi === 'khach' ? r.don_vi : [r.ma_nv, r.phong_ban].filter(Boolean).join(' · ')) || '';
    o.appendChild(chu);
    return o;
  }

  const gio_ngan = (r) => r.thoi_gian.slice(11, 16);

  async function xoa_anh_la(ma) {
    if (!confirm(t('hoi_xoa_anh_la'))) return false;
    const r = await goi_api(`/api/anh_la/${ma}`, { method: 'DELETE' });
    thong_bao(r.thong_bao, !r.ok);
    if (trang_hien === 'activity') tai_nhat_ky(); else cap_nhat_tong_quan();
    return true;
  }

  // =====================================================================
  //  TRANG OVERVIEW: hôm nay ở văn phòng
  // =====================================================================
  function ve_bieu_do_gio(theo_gio) {
    const s = $('tq-bieu-do'), W = 640, H = 180, dau = 6, cuoi = 21;    // 6h sáng -> 21h tối
    const cac_gio = theo_gio.slice(dau, cuoi + 1), max = Math.max(1, ...cac_gio);
    const rong = W / cac_gio.length;
    let html = '';
    cac_gio.forEach((so, i) => {
      const cao = so / max * (H - 44), x = i * rong + rong * 0.18, w = rong * 0.64, y = H - 22 - cao;
      html += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(cao, so ? 2 : 0).toFixed(1)}" rx="4" class="cot"></rect>`;
      if (so) html += `<text x="${(x + w / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" class="so">${so}</text>`;
      if ((dau + i) % 3 === 0) html += `<text x="${(x + w / 2).toFixed(1)}" y="${H - 4}" text-anchor="middle" class="nhan">${dau + i}h</text>`;
    });
    html += `<line x1="0" x2="${W}" y1="${H - 22}" y2="${H - 22}" class="truc"></line>`;
    s.innerHTML = html;
  }

  async function cap_nhat_tong_quan() {
    let tt, tq, sk;                            // (không đặt tên `t` vì trùng hàm dịch t())
    try {
      [tt, tq, sk] = await Promise.all([goi_api('/api/trang_thai'), goi_api('/api/tong_quan'), goi_api(`/api/nhat_ky?ngay=${hom_nay_iso()}&gioi_han=8`)]);
    } catch (e) { return; }
    const dat = (id, chu) => { $(id).textContent = chu; };
    // 4 ô số liệu
    dat('tq-da-den', `${tq.da_den.length} / ${tq.so_nhan_vien}`);
    dat('tq-chua-den-so', tq.chua_den.length ? t('chua_den_n', { n: tq.chua_den.length }) : t('moi_nguoi_da_den'));
    dat('tq-khach', tq.so_khach); dat('tq-luot', t('luot_n', { n: tq.so_luot }));
    const la_cuoi = sk.find(r => r.loai === 'la');
    dat('tq-la', tq.so_la); dat('tq-la-cuoi', la_cuoi ? t('la_cuoi', { g: gio_ngan(la_cuoi) }) : t('khong_co'));
    dat('tq-camera', tt.camera_chay ? t('song') : t('tat')); dat('tq-detector', tt.detector);
    $('tq-camera').parentElement.classList.toggle('tot', tt.camera_chay);
    $('tq-camera').parentElement.classList.toggle('xau', !tt.camera_chay);
    // hoạt động gần đây
    const ul = $('tq-su-kien'); ul.innerHTML = sk.length ? '' : `<li class="trong">${t('hd_trong')}</li>`;
    for (const r of sk) {
      const li = document.createElement('li');
      li.insertAdjacentHTML('beforeend', `<span class="gio-sk">${gio_ngan(r)}</span>`);
      li.appendChild(o_nguoi_su_kien(r)); li.appendChild(chip_loai(r));
      ul.appendChild(li);
    }
    // chưa đến
    dat('tq-chua-den-dem', `${tq.chua_den.length} / ${tq.so_nhan_vien}`);
    const ul2 = $('tq-chua-den'); ul2.innerHTML = tq.chua_den.length ? '' : `<li class="trong">${t('moi_nguoi_da_den')}</li>`;
    for (const x of tq.chua_den.slice(0, 8)) {
      const n = tim_nguoi(x.id);
      const li = document.createElement('li');
      const a = document.createElement('a'); a.className = 'hang-gon'; a.href = `#person/${x.id}`;
      a.appendChild(n ? anh_dai_dien(n, 34) : tao_chu_dau(x.ho_ten, 34));
      a.insertAdjacentHTML('beforeend', '<span class="ten"></span><span class="phu"></span>');
      a.querySelector('.ten').textContent = x.ho_ten; a.querySelector('.phu').textContent = x.phong_ban || x.ma_nv;
      li.appendChild(a); ul2.appendChild(li);
    }
    ve_bieu_do_gio(tq.theo_gio);
    // hệ thống
    dat('tq-model', tt.model); dat('tq-nguong', tt.nguong.toFixed(2));
    dat('tq-nguoi', tt.so_nguoi); dat('tq-anh', tt.so_anh); dat('tq-ms', `${tt.nhan_dien_ms} ms`);
    const h = Math.floor(tt.chay_giay / 3600), m = Math.floor(tt.chay_giay % 3600 / 60);
    dat('tq-chay', h ? t('gio_phut', { h, m }) : t('phut', { m }));
  }
  setInterval(() => { if (trang_hien === 'overview') cap_nhat_tong_quan(); }, 5000);

  // =====================================================================
  //  TRANG NHẬT KÝ: lọc theo ngày, loại, tên; tải CSV
  // =====================================================================
  let nk_hang = [], nk_loai = '';
  const o_ngay = $('nk-ngay');
  o_ngay.value = hom_nay_iso();

  async function tai_nhat_ky() {
    const q = new URLSearchParams({ gioi_han: 1000 });
    if (o_ngay.value) q.set('ngay', o_ngay.value);
    if (nk_loai) q.set('loai', nk_loai);
    try { nk_hang = await goi_api(`/api/nhat_ky?${q}`); } catch (e) { return; }
    $('nk-csv').href = `${API}/api/nhat_ky.csv?${q}`;
    ve_nhat_ky();
  }

  function ve_nhat_ky() {
    const tim = $('nk-tim').value.trim().toLowerCase();
    const hien = nk_hang.filter(r => !tim || [r.ho_ten, r.ma_nv, r.phong_ban, r.don_vi].some(x => (x || '').toLowerCase().includes(tim)));
    $('nk-dem').textContent = `${o_ngay.value ? new Date(o_ngay.value + 'T00:00').toLocaleDateString(VUNG(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : t('nk_tat_ca_ngay')} · ${t('nk_dem', { n: hien.length })}`;
    const tb = $('nk-dong'); tb.innerHTML = '';
    if (!hien.length) { tb.innerHTML = `<tr><td colspan="5" class="trong">${t('nk_khong_co')}</td></tr>`; return; }
    for (const r of hien) {
      const tr = document.createElement('tr');
      const td_gio = document.createElement('td'); td_gio.className = 'gio-sk';
      td_gio.textContent = o_ngay.value ? r.thoi_gian.slice(11, 19) : r.thoi_gian.replace('T', ' ').slice(0, 16);
      const td_nguoi = document.createElement('td'); td_nguoi.appendChild(o_nguoi_su_kien(r));
      const td_loai = document.createElement('td'); td_loai.appendChild(chip_loai(r));
      const td_kc = document.createElement('td'); td_kc.className = 'so'; td_kc.textContent = r.khoang_cach == null ? '–' : r.khoang_cach.toFixed(2);
      const td_nut = document.createElement('td'); td_nut.className = 'cot-nut';
      if (r.loai === 'la' && r.ma_anh && !r.nguoi_id) {
        const a = document.createElement('a');
        a.className = 'nut nut-nho-gon'; a.href = `#add/la/${r.ma_anh}`; a.textContent = t('dang_ky');
        td_nut.appendChild(a);
      }
      tr.append(td_gio, td_nguoi, td_loai, td_kc, td_nut);
      tb.appendChild(tr);
    }
  }
  o_ngay.addEventListener('change', tai_nhat_ky);
  $('nk-hom-nay').onclick = () => { o_ngay.value = hom_nay_iso(); tai_nhat_ky(); };
  $('nk-moi-ngay').onclick = () => { o_ngay.value = ''; tai_nhat_ky(); };
  $('nk-tim').addEventListener('input', ve_nhat_ky);
  document.querySelectorAll('#nk-loai [data-loc]').forEach(nut => {
    nut.onclick = () => {
      nk_loai = nut.dataset.loc;
      document.querySelectorAll('#nk-loai [data-loc]').forEach(x => x.setAttribute('aria-checked', x === nut));
      tai_nhat_ky();
    };
  });
  // đang xem hôm nay thì tự cập nhật 10 giây một lần
  setInterval(() => { if (trang_hien === 'activity' && (!o_ngay.value || o_ngay.value === hom_nay_iso())) tai_nhat_ky(); }, 10000);

  async function tai_danh_sach() {
    try { ds = await goi_api('/api/nguoi'); } catch (e) { return; }
    ve_danh_sach();
  }

  // ---- Cài đặt: giao diện sáng/tối (lưu trên trình duyệt) + ngôn ngữ (lưu trên server) ----
  function lay_giao_dien() { try { return localStorage.getItem('giao_dien') || 'toi'; } catch (e) { return 'toi'; } }
  function ap_giao_dien(lua_chon) {
    try { localStorage.setItem('giao_dien', lua_chon); } catch (e) { /* trình duyệt chặn lưu: vẫn đổi được lần này */ }
    const that = lua_chon === 'he_thong' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'toi' : 'sang') : lua_chon;
    document.documentElement.dataset.theme = that;
    document.querySelectorAll('[data-giao-dien]').forEach(b => b.setAttribute('aria-checked', b.dataset.giaoDien === lua_chon));
  }
  document.querySelectorAll('[data-giao-dien]').forEach(b => { b.onclick = () => ap_giao_dien(b.dataset.giaoDien); });
  $('nhanh-giao-dien').onclick = () => ap_giao_dien(document.documentElement.dataset.theme === 'toi' ? 'sang' : 'toi');
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (lay_giao_dien() === 'he_thong') ap_giao_dien('he_thong'); });
  ap_giao_dien(lay_giao_dien());

  function hien_ngon_ngu() {
    $('nhanh-ngon-ngu').textContent = NGON_NGU.toUpperCase();
    document.querySelectorAll('[data-ngon-ngu]').forEach(b => b.setAttribute('aria-checked', b.dataset.ngonNgu === NGON_NGU));
  }
  async function doi_ngon_ngu(nn) {
    if (nn === NGON_NGU) return;
    const r = await goi_api('/api/ngon_ngu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ngon_ngu: nn }) });
    if (!r.ok) { thong_bao(r.thong_bao, true); return; }
    NGON_NGU = nn;
    dich_trang(); hien_ngon_ngu(); ngay_hom_nay();
    ve_danh_sach(); cap_nhat_tong_quan(); ve_form_them(); ve_nhat_ky(); nap_cai_dat();    // vẽ lại các phần chữ do JS tạo
    if (trang_hien === 'add') ve_che_do_them();
    if (trang_hien === 'person') ve_ho_so();
    thong_bao(t('da_luu'));
  }
  document.querySelectorAll('[data-ngon-ngu]').forEach(b => { b.onclick = () => doi_ngon_ngu(b.dataset.ngonNgu); });
  $('nhanh-ngon-ngu').onclick = () => doi_ngon_ngu(NGON_NGU === 'en' ? 'vi' : 'en');
  hien_ngon_ngu();

  // ---- Settings > Màn hình chào: lời chào + xem trước ----
  let lc_mac_dinh = {};
  const form_lc = $('form-loi-chao');
  function ve_xem_truoc() {
    const mau = {}; for (const el of form_lc.querySelectorAll('[name]')) mau[el.name] = el.value.trim() || lc_mac_dinh[el.name] || '';
    const the = (lop) => `<div class="the-mau ${lop}"><div class="loi-chao"></div><div class="ten"></div><div class="nhan"></div></div>`;
    const kq = $('xt-chao');
    kq.innerHTML = the('') + the('') + the('la');                   // nhân viên, khách, người lạ
    const [a, b, c] = kq.children;
    const dat = (el, x, y, z) => { el.children[0].textContent = x; el.children[1].textContent = y; el.children[2].textContent = z; };
    dat(a, loi_chao_cho('nhan_vien', mau), t('vd_ten_nv'), t('vd_phong'));
    dat(b, loi_chao_cho('khach', mau), t('vd_ten_khach'), `${t('khach')} · ${t('vd_cty')}`);
    dat(c, mau.la_tieu_de, mau.la_dong, t('nhan_la'));
  }
  form_lc.addEventListener('input', ve_xem_truoc);
  form_lc.onsubmit = async (e) => {
    e.preventDefault();
    const lc = {}; for (const el of form_lc.querySelectorAll('[name]')) lc[el.name] = el.value.trim();
    const r = await goi_api('/api/cai_dat', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ loi_chao: lc }) });
    thong_bao(r.thong_bao, !r.ok);
  };
  $('lc-mac-dinh').onclick = () => { form_lc.querySelectorAll('[name]').forEach(el => { el.value = ''; }); ve_xem_truoc(); };

  // ---- Settings > Bảo mật: đổi mật khẩu ----
  $('form-mk').onsubmit = async (e) => {
    e.preventDefault();
    const [cu, moi, moi2] = ['mk-cu', 'mk-moi', 'mk-moi2'].map(id => $(id).value);
    if (moi !== moi2) { thong_bao(t('dn_khong_khop'), true); return; }
    const r = await goi_api('/api/doi_mat_khau', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cu, moi }) });
    thong_bao(r.thong_bao, !r.ok);
    if (r.ok) $('form-mk').reset();
  };

  async function nap_cai_dat() {
    let cd;
    try { cd = await goi_api('/api/cai_dat'); } catch (e) { return; }
    // lời chào: ô nào đang dùng mặc định thì để trống (hiện mặc định làm chữ mờ)
    lc_mac_dinh = cd.loi_chao_mac_dinh;
    $('cd-man-chao-mo').textContent = t('cd_man_chao_mo', { nn: t(`ten_nn_${NGON_NGU}`) });
    for (const el of form_lc.querySelectorAll('[name]')) {
      el.placeholder = lc_mac_dinh[el.name];
      el.value = cd.loi_chao[el.name] === lc_mac_dinh[el.name] ? '' : cd.loi_chao[el.name];
    }
    ve_xem_truoc();
    const chon = $('cd-giu-anh');
    chon.innerHTML = cd.cac_lua_chon.map(n => `<option value="${n}">${n === 0 ? t('giu_0') : n === 1 ? t('giu_1') : t('giu_n', { n })}</option>`).join('');
    chon.value = cd.giu_anh_la_ngay;
  }
  $('cd-giu-anh').onchange = async (e) => {
    const r = await goi_api('/api/cai_dat', { method: 'PUT', headers: { 'Content-Type': 'application/json' },
                                             body: JSON.stringify({ giu_anh_la_ngay: Number(e.target.value) }) });
    thong_bao(r.thong_bao, !r.ok);
  };
  nap_cai_dat();

  $('nut-dang-xuat').onclick = async () => {
    await goi_api('/api/dang_xuat', { method: 'POST' });
    location.href = 'login.html';
  };

  ve_form_them();
  tai_danh_sach().then(mo_trang);
}

// ===== Trang đăng nhập (login.html) =====
async function chay_trang_dang_nhap() {
  const form = document.getElementById('form-dang-nhap');
  const o_mk = document.getElementById('mat-khau'), o_mk2 = document.getElementById('mat-khau-2');
  const nut = document.getElementById('nut-gui'), loi = document.getElementById('loi');
  const phien = await goi_api('/api/phien');
  if (phien.da_dang_nhap) { location.href = 'admin.html'; return; }
  const lan_dau = !phien.da_dat_mat_khau;            // chưa có mật khẩu -> đặt mật khẩu mới
  if (lan_dau) {
    document.getElementById('tieu-de').textContent = t('dn_dat');
    document.getElementById('mo-ta').textContent =
      t('dn_dat_mo');
    document.getElementById('khoi-nhap-lai').hidden = false;
    o_mk.autocomplete = 'new-password';
    nut.textContent = t('dn_dat_nut');
  }
  o_mk.focus();

  form.onsubmit = async (e) => {
    e.preventDefault();
    loi.textContent = '';
    if (lan_dau && o_mk.value !== o_mk2.value) { loi.textContent = t('dn_khong_khop'); return; }
    nut.disabled = true;
    try {
      const r = await goi_api(lan_dau ? '/api/dat_mat_khau' : '/api/dang_nhap', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mat_khau: o_mk.value }),
      });
      if (r.ok) { location.href = 'admin.html'; return; }
      loi.textContent = r.thong_bao;
      o_mk.select();
    } catch (e) {
      loi.textContent = t('mat_server');
    }
    nut.disabled = false;
  };
}

// Trang nào có phần tử nào thì chạy phần đó
// (nạp ngôn ngữ từ server trước, để chữ hiện đúng ngay từ đầu)
nap_ngon_ngu().then(() => {
  if (document.getElementById('cac-the')) chay_man_hinh_chao();
  if (document.getElementById('ds')) chay_trang_quan_ly();
  if (document.getElementById('form-dang-nhap')) chay_trang_dang_nhap();
});

# FaceGreet — Lễ tân thông minh cho văn phòng

Bài cuối kỳ môn **Thực tập doanh nghiệp** — Nguyễn Đức Minh (MSV 24022404).
Đề bài: *"Nhận diện khuôn mặt qua camera và chào hỏi được tên"*.

Phần mềm đặt ở cửa ra vào văn phòng: camera nhìn thấy ai thì màn hình chào người đó bằng tên,
đồng thời ghi lại giờ đến. Người lạ được chụp lại để lễ tân xem và đăng ký nếu cần.

## Tính năng

**Màn hình chào** (`index.html`, để ở cửa)
- Khung bám theo khuôn mặt, chào "Chào buổi sáng, Anh Minh" kèm phòng ban, hoặc "Khách · đơn vị".
- Nhân viên đã nghỉ việc hoặc khách đã hết hạn thì không chào, được coi như người lạ.
- Nút **Show stats** hiện thông số: thời gian xử lý, chất lượng mặt, bản đồ khuôn mặt, khoảng cách tới ngưỡng.

**Trang quản lý** (`admin.html`, phải đăng nhập)
- Tổng quan hôm nay: ai đã đến hoặc chưa đến, số khách, số người lạ, biểu đồ lượt theo giờ.
- Danh bạ nhân viên và khách: thêm người, xem hồ sơ, xem, thêm hoặc xóa từng ảnh khuôn mặt.
- Nhật ký ra vào: lọc theo ngày hoặc loại người, tải về file CSV mở bằng Excel.
- Ảnh người lạ: xem, xóa, hoặc đăng ký thành người mới từ chính ảnh đó.
- Cài đặt: giao diện sáng/tối, tiếng Anh/tiếng Việt, số ngày giữ ảnh người lạ, lời chào, đổi mật khẩu.

## Cách hoạt động

```
Camera ──► server (app.py) ──► video ──► trình duyệt
                                         │  MediaPipe tìm VỊ TRÍ mặt khoảng 30 lần/giây, vẽ khung mượt
                ◄── vị trí các mặt ──────┘  (gửi lên 5 lần/giây)
  server cắt vùng mặt ─► RetinaFace căn chỉnh ─► ArcFace tạo vector 512 số
  ─► so khoảng cách với vector đã đăng ký ─► nhỏ hơn ngưỡng 0.55 thì là người đó
```

- **Model:** ArcFace (thư viện `deepface`). Không tự huấn luyện, chỉ dùng model có sẵn.
- **Ngưỡng 0.55** (khoảng cách cosin): chọn bằng thực nghiệm trên LFW trong notebook `02_test_nhan_dien`.
- Mỗi người đăng ký **nhiều ảnh**. Vector chỉ được tính **một lần** lúc đăng ký rồi lưu lại.
- Nếu trình duyệt không chạy được MediaPipe, server tự tìm mặt (YuNet, rồi Haar, rồi RetinaFace).

## Cài đặt (Windows)

Cần **Python 3.10–3.12** và một webcam.

```powershell
cd PhanLamViec
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Chạy

```powershell
cd PhanLamViec
.venv\Scripts\activate
python app.py
```

Mở trình duyệt:
- Màn hình chào: http://localhost:5000
- Trang quản lý: http://localhost:5000/admin.html. Lần đầu chạy, trang này yêu cầu **đặt mật khẩu**.

Lần chạy đầu tiên cần mạng để tải model ArcFace và RetinaFace (khoảng vài trăm MB, `deepface` tự lưu vào
`C:\Users\<tên>\.deepface`). Từ lần sau **không cần mạng**: MediaPipe và phông chữ đã có sẵn trong thư mục `thu_vien/`.

## Cách dùng nhanh

1. Vào **Manage → Add person**, nhập họ tên, mã nhân viên hoặc đơn vị (với khách), đánh dấu ô **đồng ý**.
2. Đứng trước camera, bấm chụp. Nên chụp thêm 3–5 ảnh: nhìn thẳng, hơi nghiêng, đeo kính hoặc không.
3. Quay lại màn hình chào, đi qua camera và xem lời chào.
4. Xem giờ đến ở **Activity**, tải CSV nếu cần.

## Cấu trúc thư mục

```
PhanLamViec/
├── app.py              server Flask: camera, các luồng nhận diện, API, đăng nhập
├── face_core.py        tìm mặt, tạo vector, danh bạ (SQLite), nhật ký, ảnh người lạ
├── requirements.txt
├── frontend/           index.html (màn chào), admin.html, login.html, style.css, script.js
├── thu_vien/           MediaPipe + model tìm mặt + phông Inter (để chạy khi không có mạng)
│
│   (các file dưới đây tự sinh khi chạy, KHÔNG đưa lên GitHub)
├── du_lieu.db          hồ sơ, vector khuôn mặt, nhật ký ra vào
├── cai_dat.json        mật khẩu (đã mã hóa), ngôn ngữ, lời chào, số ngày giữ ảnh
├── anh_dang_ky/        ảnh khuôn mặt đã đăng ký
├── anh_nguoi_la/       ảnh chụp người lạ (tự xóa sau số ngày đã cài)
└── face_detection_yunet_2023mar.onnx   model YuNet (tự tải khi cần)
```

## Dữ liệu cá nhân và quyền riêng tư

Ảnh khuôn mặt là **dữ liệu sinh trắc học**, thuộc nhóm dữ liệu nhạy cảm theo Luật Bảo vệ dữ liệu cá nhân
số 91/2025/QH15 (hiệu lực từ 01/01/2026). Hệ thống được thiết kế như sau:
- Chỉ đăng ký khi người đó **đồng ý** (ô "đồng ý" trong form, được lưu lại).
- Chỉ thu **thông tin tối thiểu**: tên, danh xưng, mã nhân viên, phòng ban hoặc đơn vị. Không có địa chỉ,
  số điện thoại hay số căn cước.
- Ảnh người lạ **tự xóa** sau 0/1/7/30/90 ngày (mặc định 7).
- Trang quản lý có mật khẩu. Mọi dữ liệu nằm trên máy, không gửi lên mạng.
- `.gitignore` đã loại toàn bộ ảnh, cơ sở dữ liệu và mật khẩu, nên **không đưa ảnh mặt lên GitHub**.

## Biến môi trường (không bắt buộc)

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `CAMERA_SOURCE` | `0` | `0` là webcam của máy, hoặc một URL luồng video (ví dụ `http://host.docker.internal:8554/...`) |
| `FILE_DU_LIEU` | `du_lieu.db` | cơ sở dữ liệu |
| `FILE_CAI_DAT` | `cai_dat.json` | file cài đặt |
| `THU_MUC_ANH`, `THU_MUC_ANH_LA` | `anh_dang_ky`, `anh_nguoi_la` | nơi lưu ảnh |
| `FRONTEND_DIR`, `THU_MUC_THU_VIEN` | `frontend`, `thu_vien` | giao diện, thư viện |
| `FILE_DANH_BA` | `danh_ba.npz` | file của bản cũ, tự chuyển sang SQLite rồi đổi tên thành `.npz.cu` |

## Gặp lỗi?

| Hiện tượng | Cách xử lý |
|---|---|
| Khung bám mặt chậm hoặc giật | Mở F12 → Console, xem có dòng "Bám mặt bằng MediaPipe" không. Nếu không có, kiểm tra thư mục `thu_vien/` có đủ file chưa. |
| Terminal báo lỗi YuNet | Thường do đường dẫn có dấu tiếng Việt. Bản hiện tại đã đọc model theo cách khác để tránh lỗi này. Nếu vẫn lỗi, server tự dùng cách dự phòng. |
| Không có hình | Đóng các ứng dụng khác đang dùng webcam (Zoom, Camera...), hoặc thử `set CAMERA_SOURCE=1`. |
| Lỗi liên quan đến Keras hoặc TensorFlow | Cài lại: `pip install -r requirements.txt` (cần gói `tf-keras`). |
| Quên mật khẩu | Tắt server, xóa dòng `mat_khau` trong `cai_dat.json` (hoặc xóa cả file), chạy lại để đặt mật khẩu mới. |

## Nghiên cứu (thư mục notebook, chạy trên Kaggle)

| Notebook | Nội dung |
|---|---|
| `00_tai_du_lieu` | chuẩn bị LFW (13.233 ảnh, 5.749 người) và CPLFW (6.000 cặp mặt nghiêng) |
| `01_tao_vector` | tạo vector cho mọi ảnh với ArcFace, SFace, Facenet512, VGG-Face |
| `02_test_nhan_dien` | thử nghiệm "đây là ai?": nhận đúng, gọi sai tên, nhận nhầm người lạ; chọn ngưỡng |

## Hạn chế

- Ảnh webcam thật chỉ có 2 người. LFW và CPLFW là ảnh người nổi tiếng, khác điều kiện ánh sáng của webcam.
- Không chống giả mạo: có thể lừa bằng ảnh in hoặc màn hình điện thoại.
- Một máy chủ cho một camera. Chưa đóng gói Docker.

## Giấy phép thư viện bên thứ ba

- MediaPipe Tasks Vision và model BlazeFace (Google): Apache-2.0
- Phông chữ Inter (Rasmus Andersson): SIL Open Font License 1.1 (`thu_vien/fonts/LICENSE-Inter.txt`)
- deepface (Sefik Ilkin Serengil): MIT

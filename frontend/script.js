<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FaceGreet</title>
<link rel="stylesheet" href="thu_vien/fonts/inter.css">   <!-- phông Inter có sẵn trong máy, không cần mạng -->
<link rel="stylesheet" href="style.css">
</head>
<body class="trang-chao">
  <header class="thanh-tren">
    <div class="thuong-hieu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M5 21V10a7 7 0 0 1 14 0v11"/><path d="M3 21h18"/>
      </svg>
      FaceGreet
    </div>
    <div class="phai">
      <span class="dong-ho" id="dong-ho"></span>
      <span id="ngay"></span>
      <span class="den-camera" data-i18n="camera_song">Camera live</span>
      <button class="nut" id="nut-thong-so" data-i18n="hien_ts">Show stats</button>
      <a class="nut" href="admin.html" data-i18n="quan_ly">Manage</a>
    </div>
  </header>

  <main class="san-khau">
    <!-- ===== Cột trái (chế độ thông số): máy đang chạy thế nào ===== -->
    <aside class="bang" aria-label="System stats">
      <section class="o">
        <div class="o-tieu-de" data-i18n="ts_he_thong">System</div>
        <div class="dong"><span data-i18n="ts_model">Model</span><b id="ts-model">–</b></div>
        <div class="dong"><span data-i18n="ts_detector">Detector</span><b id="ts-detector">–</b></div>
        <div class="dong"><span data-i18n="ts_nguong">Threshold</span><b id="ts-nguong">–</b></div>
      </section>

      <section class="o gian">
        <div class="o-tieu-de" data-i18n="ts_thoi_gian">Processing time</div>
        <div class="dong"><span><i class="cham" style="background:var(--ngoc)"></i><span data-i18n="ts_tim">Detection</span></span><b id="ts-tim-mat">–</b></div>
        <div class="dong"><span><i class="cham" style="background:var(--xanh-duong)"></i><span data-i18n="ts_nhan">Recognition</span></span><b id="ts-nhan-dien">–</b></div>
        <svg class="do-thi" id="do-thi-ms" viewBox="0 0 260 60" preserveAspectRatio="none"></svg>
      </section>

      <section class="o">
        <div class="o-tieu-de" data-i18n="ts_chat_luong">Face quality</div>
        <div class="dong"><span data-i18n="cl_goc">Frontal pose</span><b id="cl-goc">–</b></div><div class="thanh"><div class="day" id="cl-goc-thanh"></div></div>
        <div class="dong"><span data-i18n="cl_net">Sharpness</span><b id="cl-net">–</b></div><div class="thanh"><div class="day" id="cl-net-thanh"></div></div>
        <div class="dong"><span data-i18n="cl_tp">Contrast</span><b id="cl-tp">–</b></div><div class="thanh"><div class="day" id="cl-tp-thanh"></div></div>
      </section>

      <section class="o">
        <div class="o-tieu-de" data-i18n="ts_phien">Session</div>
        <div class="luoi-so">
          <div><span data-i18n="tk_luot">Greetings</span><b id="tk-luot">0</b></div>
          <div><span data-i18n="tk_la">Unknown</span><b id="tk-la">0</b></div>
          <div><span data-i18n="tk_nguoi">People</span><b id="tk-nguoi">0</b></div>
          <div><span data-i18n="tk_chay">Uptime</span><b id="tk-chay">–</b></div>
        </div>
      </section>
    </aside>

    <!-- ===== Giữa: camera ===== -->
    <div class="giua">
      <div class="khung-video">
        <div class="anh-sang"></div>
        <img id="video" alt="Camera feed">
        <canvas id="lop-ngam"></canvas>
      </div>

      <!-- Khu dưới video: chiều cao cố định để video không bị xê dịch khi đổi chế độ -->
      <div class="vung-duoi">
        <div class="cac-the" id="cac-the" aria-live="polite"></div>

        <div class="hud-duoi">
          <div class="anh-mat" id="anh-mat"></div>
          <div class="chu-giai">
            <span><i style="background:var(--ngoc)"></i><span data-i18n="cg_chac">Match</span></span>
            <span><i style="background:var(--xanh-lo)"></i><span data-i18n="cg_gan">Near threshold</span></span>
            <span><i style="background:var(--ho-phach)"></i><span data-i18n="cg_la">Unknown</span></span>
            <span><i style="background:#C9D1DD"></i><span data-i18n="cg_cho">Scanning</span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Cột phải (chế độ thông số): máy quyết định thế nào ===== -->
    <aside class="bang" aria-label="Recognition details">
      <section class="o gian lon">
        <div class="o-tieu-de" data-i18n="ts_ban_do">Face map</div>
        <svg class="ban-do" id="ban-do"></svg>
      </section>

      <section class="o">
        <div class="o-tieu-de" data-i18n="ts_ung_vien">Nearest matches</div>
        <ul class="ung-vien" id="ung-vien"></ul>
      </section>

      <section class="o gian">
        <div class="o-tieu-de"><span class="chu-tieu-de" data-i18n="ts_kc">Distance over time</span> <span><i class="net-dut"></i><span data-i18n="nguong_chu">threshold</span></span></div>
        <svg class="do-thi" id="do-thi-kc" viewBox="0 0 260 70" preserveAspectRatio="none"></svg>
      </section>

      <section class="o">
        <div class="o-tieu-de" data-i18n="ts_nhat_ky">Event log</div>
        <ol class="nhat-ky" id="nhat-ky"></ol>
      </section>
    </aside>
  </main>

  <script src="script.js"></script>
</body>
</html>

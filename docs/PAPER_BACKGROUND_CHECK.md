# Kiểm tra nền giấy — 30/09/2026

Đã dùng ảnh `docs/presentation/bg.jpg` qua bản phục vụ web `public/bg.jpg` (hai file có cùng SHA-256). Nền giấy chỉ nằm trong năm chặng nội dung; một lớp sticky dùng chung, không lặp ảnh giấy theo từng chặng. Theo phản hồi của người dùng, **giữ `body_bg_01.jpg` làm lớp collage phủ trên `bg.jpg`**, bám mép trái mỗi chặng. Collage dùng `multiply`, opacity 0,38 trên desktop và 0,22 trên mobile, có mask làm mềm mép và nằm dưới chữ/model. Hai mép nền giấy chuyển về màu `#f2eee5` trước Hero/Footer, không thay ảnh và video gốc. Các lớp nền không nhận thao tác chuột và được ẩn khi in.

Tăng padding trên khối chữ mobile từ 16 lên 40 px để có khoảng hở với model.

## Tài liệu đối chiếu

`PROJECT_DIRECTION_AND_IMPLEMENTATION_PLAN.md` là định hướng hiện hành: Hero → năm chặng → Footer; một canvas; chữ đổi bên trên desktop và nằm dưới model trên mobile; giữ CTA ôn tập và nguồn.

`UI_UX_AUDIT.md` và `design/LANDING_PAGE_MOTION_DESIGN.md` có ghi chú lưu trữ. Không dùng mô tả bố cục hoặc kết quả kiểm tra cũ như bằng chứng cho lượt này. Nền mới là ảnh nền chính với opacity 0,65, không phải lớp grain overlay 0,08–0,16 trong bản thiết kế lưu trữ.

## Kết quả Playwright Chromium

| Kiểm tra | Kết quả / bằng chứng |
| --- | --- |
| Hai ảnh nền | `/bg.jpg` và `/body_bg_01.jpg` trả HTTP 200. Nền giấy nằm ở `journey-chapters::before`; collage nằm ở `journey-stop::before`. Lượt kiểm tra sau phản hồi xác nhận cả hai background ở 320, 390, 768 và 1440 px, không tràn ngang và không có `pageerror`. |
| Phân lớp | Nền sticky có `z-index: -1` trong wrapper được cô lập; collage `z-index: 0`, chữ `z-index: 1`, canvas nằm trên lớp đọc. Các lớp nền có `pointer-events: none`. Hero/Footer có vùng ảnh riêng. Đã xem ảnh chụp hai lớp trên desktop và mobile. |
| Responsive | 320 × 844, 390 × 844, 768 × 900, 1440 × 900: không tràn ngang. Lượt đầu cuộn qua đủ năm chặng và Footer ở cả bốn chiều rộng; lượt production cuối kiểm tra lại chặng đầu ở cả bốn chiều rộng. |
| Hero/Footer | Hai ảnh gốc tải thành công. Đúng nguồn `/hero/hero_motion_layered_v2.mp4` và `/footer/footer_motion.mp4`. |
| 3D và bố cục | Một canvas ở cả bốn chiều rộng. Khi cuộn, transform thay đổi cả vị trí và scale, đổi trái/phải giữa các chặng. Đã xem ảnh chữ bên trái và bên phải trên desktop; chữ dưới model trên mobile. |
| Bàn phím | Tab đầu tiên vào “Đến nội dung chính”, có outline; Enter đến `#noi-dung`. |
| Giảm chuyển động | Video Hero/Footer không được tạo khi tải trang với `reduce`; chữ có transform `none`, opacity 1; scroll behavior `auto`. Phần 3D còn thiếu, xem bên dưới. |
| Model lỗi tải | Giả lập HTTP 503 cho GLB trong context riêng: hiện thông báo fallback, đủ năm tiêu đề trong DOM, nền vẫn có. |
| Ôn tập | CTA Footer đến `/on-tap`; chọn ôn tập, bắt đầu, trả lời một câu, hiện lời giải, kết thúc và chọn bài khác đều hoạt động. Ảnh nền mới không lan sang route ôn tập. |
| In | Pseudo-element chứa ảnh nền có `display: none` khi emulate `print`. |
| Lỗi runtime | Lượt production cuối không ghi nhận `pageerror` hoặc console error trong luồng tải trang, đổi viewport, đến Footer và ôn tập. |
| Chất lượng mã | `npm run lint`, `npm run typecheck`, `npm run build` thành công. Bản build cuối được tạo khi máy chủ dev đã dừng. |

## Hai điểm chưa khớp tài liệu hiện hành

1. **Thiếu nút dừng 3D.** Tài liệu hiện hành mô tả nút này, nhưng trang thực tế không có button điều khiển 3D.
2. **Giảm chuyển động chưa giữ model tĩnh.** Với `prefers-reduced-motion: reduce`, cuộn từ nguồn gốc sang bản chất vẫn đổi transform canvas: từ `translate3d(4.66%, -20.05%, 0) scale(1.059)` sang `translate3d(-8.71%, -22.90%, 0) scale(1.127)`. Chữ/video đã giảm chuyển động; vị trí, kích thước và camera 3D vẫn theo tiến độ cuộn. Vì vậy không thể áp dụng lại kết luận “model không đổi khi cuộn” trong audit cũ.

Hai điểm này thuộc luồng 3D đã có trước thay đổi nền; lượt này ghi nhận, chưa sửa. Phần thêm nền đáp ứng bố cục và phân lớp đã kiểm tra, nhưng toàn web chưa hoàn toàn khớp các mô tả accessibility trong docs.

## Ảnh kiểm tra

- `.work/layered-paper-1440.png` — hai lớp nền sau phản hồi.
- `.work/layered-paper-390.png` — hai lớp nền trên mobile sau phản hồi.
- `.work/paper-desktop-chapter.png`
- `.work/paper-desktop-alternate.png`
- `.work/paper-mobile-320-chapter.png`
- `.work/paper-mobile-390-chapter.png`
- `.work/paper-desktop-hero.png`
- `.work/paper-desktop-footer.png`
- `.work/paper-mobile-footer.png`

Các ảnh `layered-paper-*` thể hiện bố cục hiện hành với collage phủ trên giấy; các ảnh `paper-*` lưu lượt kiểm tra nền giấy trước phản hồi. Lỗi HMR của Turbopack xuất hiện trong lượt trước khi chạy build cùng máy chủ dev; đã dừng máy chủ dev và chạy lại build/production để kiểm chứng. Lượt build sau điều chỉnh collage cũng chạy khi dev đã dừng.

Chưa đo tương phản trên từng vùng ảnh, FPS trên máy yếu, screen reader, Safari/Firefox hoặc thiết bị cảm ứng thật. Đây là báo cáo kiểm tra có phạm vi, không phải chứng nhận toàn bộ WCAG.

> Lưu trữ lượt kiểm tra trước. Hero và Footer đã được khôi phục theo yêu cầu tiếp theo; xem PROJECT_DIRECTION_AND_IMPLEMENTATION_PLAN.md cho bố cục và kiểm chứng hiện hành.

# Kiểm tra UI/UX — 26/09/2026

Phạm vi: trang `/`, hành trình 3D và luồng `/on-tap`.

Tham chiếu: [Impeccable audit](https://github.com/pbakaus/impeccable/blob/main/plugin/skills/impeccable/reference/audit.md) và [craft floor](https://github.com/pbakaus/impeccable/blob/main/plugin/skills/impeccable/reference/craft-floor.md). Đọc tài liệu trực tiếp từ upstream; môi trường không có launcher/detector Impeccable, nên không có kết quả quét tự động của bộ này.

## Kết quả thực tế

| Mục | Bằng chứng |
| --- | --- |
| Nội dung | 7 chặng; bỏ chuỗi bài đọc dài và video mở/kết khỏi route chính; CTA ôn tập vẫn hoạt động. |
| Camera | Wheel tiến/lùi làm đổi chặng; chỉ một canvas. Chụp so sánh xác nhận nút dừng giữ nguyên cảnh và tiếp tục làm cảnh thay đổi. |
| Giảm chuyển động | So sánh pixel vùng model trong hai ảnh toàn màn hình trước/sau cuộn: không đổi. Nội dung vẫn cuộn. |
| Responsive | Kiểm tra viewport Chromium rộng 320, 390, 768 và 1440 px: không tràn ngang. Kiểm tra trực quan desktop và 390 × 844. |
| Bàn phím | Tab đầu tiên vào “Đến nội dung chính”, có outline; các chặng là anchor, điều khiển là button. |
| Tương phản | Trên nền giấy: chữ nội dung 5,66:1, tiêu đề nhấn 4,78:1, nguồn 5,00:1, nút 10,33:1. Đây là kiểm tra nhóm màu chính, không phải chứng nhận toàn bộ WCAG. |
| Lỗi tải model | Giả lập HTTP 503 cho GLB: hiển thị thông báo, cả 7 tiêu đề vẫn có trong DOM. |
| Quiz | Gửi thiếu câu hiện validation; chọn 5 đáp án hiện kết quả; làm lại bỏ hết lựa chọn. |
| Chất lượng mã | Lint, TypeScript, production build thành công. |

## Lỗi đã xử lý

- **P1:** Loading bằng Drei Html gây lỗi React khi unmount; chuyển loading ra DOM ngoài canvas. Lần kiểm tra tải trang và đổi chặng sau sửa không ghi nhận pageerror.
- **P1:** Chuyển động bị giới hạn ở một đoạn, đổi góc qua lại và dừng ở cuối; thay bằng đường camera liên tục cho toàn trang.
- **P2:** Model chưa chuẩn hóa tâm/kích thước; căn theo bounding box để đường camera có khung hình ổn định.
- **P2:** Vùng bấm mobile nhỏ; chặng và nút có chiều cao 44 px.
- **P2:** Skip link trang quiz không có đích; thêm id nội dung chính.
- **P2:** Quiz ép smooth scroll; dùng behavior auto để theo CSS và tùy chọn giảm chuyển động.
- **P2:** Cảnh báo chuyển route khi dùng smooth scroll trên Next.js 16; bổ sung data-scroll-behavior theo tài liệu cài tại máy.

## Đánh giá có giới hạn

| Nhóm Impeccable | Điểm kiểm tra nội bộ / 4 | Giới hạn |
| --- | --- | --- |
| Accessibility | 3 | Chưa kiểm tra bằng screen reader thực tế. |
| Performance | 3 | Demand rendering, DPR giới hạn 1,5, bỏ shadow pass; GLB gốc vẫn khoảng 7,9 MB. |
| Responsive | 3 | Viewport mô phỏng, chưa kiểm tra cử chỉ trên thiết bị cảm ứng thật. |
| Theming | 2 | Giữ nhận diện giấy ngà và token hiện có; còn màu riêng trong CSS, không có chế độ tối. |
| Implementation integrity | 3 | Luồng chính và lỗi tải được kiểm tra; detector Impeccable không khả dụng. |

Tổng nội bộ: **14/20**. Không dùng điểm này như kết quả tự động của Impeccable hoặc chứng nhận khả năng truy cập.

Chưa đo FPS trên máy yếu, chưa kiểm tra Safari/Firefox và thiết bị thật. Chưa bật giám sát liên tục/CI. Ảnh kiểm tra nằm trong `.work/`.


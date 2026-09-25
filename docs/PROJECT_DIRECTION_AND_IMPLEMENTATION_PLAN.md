# Định hướng hiện hành — MLN111

Cập nhật theo yêu cầu điều chỉnh ngày 26/09/2026. **Giữ Hero và Footer gốc, bao gồm cả ảnh và video.** Không áp lại phương án bỏ hai phần này.

## Bố cục

1. Hero gốc: `/hero/hero_final_v2.webp` và `/hero/hero_motion_layered_v2.mp4`. Model nhỏ ở góc phải phía dưới.
2. Năm chặng nội dung ngắn: nguồn gốc, bản chất, đặc trưng, chức năng, lịch sử. Cuộn làm model lớn dần rồi di chuyển trái/phải, lên/xuống cùng chuyển động vị trí/kích thước/độ hiện của chữ. Chữ đổi bên trên desktop; mobile giữ chữ ở dưới model.
3. Footer gốc: `/footer/footer_final.jpg` và `/footer/footer_motion.mp4`, giữ CTA ôn tập và nguồn. Model thu nhỏ về góc.

## Cách triển khai

- `ScrollModelSection` dựng Hero, năm chặng và Footer trong cùng một hành trình. Chỉ một canvas sticky trong suốt phủ trên các phần này.
- `composition.ts` định nghĩa vị trí x/y và scale trên màn hình, có đường riêng cho desktop/mobile.
- `storyboard.ts` định nghĩa góc camera và khoảng cách để bổ sung chuyển động trên màn hình; không dùng quay tại chỗ làm chuyển động chính.
- Damping tiến độ ở bộ điều khiển scroll, truyền cùng tiến độ cho canvas transform và camera.
- Canvas dùng `resize.offsetSize` để đo kích thước layout, tránh CSS scale làm thay đổi kích thước render lần nữa.
- Cuộn native, không chặn wheel/touch. Có điều hướng chặng, nút dừng 3D và reduced motion. Nội dung vẫn ở luồng tài liệu.
- Hero/Footer giữ logic video một lần và ảnh fallback. Route `/on-tap` được giữ.

## Đã kiểm tra

Playwright: ảnh hero/footer có mặt, đúng hai nguồn video gốc, model đổi x từ khoảng +23% sang -23% và thay scale, không có pageerror trong lượt kiểm tra. Đã xem ảnh desktop/mobile 390 × 844; mobile không tràn ngang. TypeScript, lint, production build thành công.

Ảnh lần này: `.work/restored-hero.png`, `.work/restored-morph.png`, `.work/restored-footer.png`, `.work/restored-mobile-hero.png`, `.work/restored-mobile-morph.png`.

Báo cáo `UI_UX_AUDIT.md` là kết quả lượt trước; các phần mô tả bố cục bỏ hero/footer trong đó không còn áp dụng. Chưa kiểm tra thiết bị cảm ứng thật.

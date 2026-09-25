# Brief tạo 3D model cho dự án MLN111

> Tài liệu lưu trữ cho hướng thiết kế trước. Trang hiện tại không tải hoặc hiển thị model 3D.

## 1. Đối tượng cần dựng

**Đoan Môn – cổng phía Nam của Hoàng thành Thăng Long**, ở hình thái di tích hiện còn được bảo tồn.

Đây là một công trình kiến trúc Việt Nam cụ thể, gắn trực tiếp với không gian cung thành và trung tâm quyền lực chính trị qua nhiều triều đại. Vì dự án học về **Nhà nước**, Đoan Môn có thể làm hình tượng dẫn chuyện về quyền lực, thiết chế và không gian tổ chức xã hội. Công trình là trục thị giác của câu chuyện; không ngụ ý rằng các chi tiết kiến trúc tự chúng minh họa chính xác từng luận điểm lý luận.

Tư liệu chính thức giới thiệu Đoan Môn là cổng phía Nam dẫn vào Cấm thành và mô tả công trình hiện còn có năm cửa vòm. Dùng nguồn tham khảo để kiểm chứng hình dáng và lịch sử, không tự thêm chi tiết không thấy trong ảnh.

- [Trưng bày trực tuyến Hoàng thành Thăng Long – Lam Kinh / Đoan Môn](https://trungbayonline.hoangthanhthanglong.vn/LamKinh)
- [Hoàng thành Thăng Long – Đoan Môn, tính tiếp nối của một công trình cổ](https://hoangthanhthanglong.vn/doan-mon-tinh-tiep-noi-cua-mot-cong-trinh-co/)

## 2. Trả lời bộ câu hỏi tạo model

### Model là gì?

Một **mô hình kiến trúc Đoan Môn**, nhận diện được ngay là cổng thành bằng khối tường gạch lớn và các lối vòm. Giữ những đặc điểm nhìn thấy trong tư liệu: mặt cổng có năm cửa vòm, cửa giữa nổi bật hơn, khối kiến trúc có chiều ngang rõ và phần tường/lan can phía trên theo hình thái thực tế.

Đây không phải mô hình ba trụ đá, tượng trừu tượng, hay một cổng cung đình tổng hợp. Không gắn thêm mái, rồng, cờ, hoành phi hoặc họa tiết nếu ảnh tham khảo của đúng hình thái Đoan Môn không thể hiện.

### Ảnh tham chiếu cần có

Trong bộ file dự án hiện có `public/models/model.glb`, nhưng chưa xác nhận model này dựa trên tư liệu nào hoặc có đúng hình thái Đoan Môn hay không. Video và ảnh hero là tư liệu định hướng bố cục, màu sắc và không khí giấy; **không đủ để suy ra chính xác hình học của di tích**.

Để dựng sát hơn, nên gom 3–6 ảnh của cùng một hình thái công trình:

1. Mặt chính diện, thấy đủ năm cửa vòm.
2. Góc 3/4 phía trước, thấy chiều sâu công trình.
3. Mặt sau, cho thấy cấu trúc các lối đi xuyên cổng.
4. Góc bên trái hoặc bên phải.
5. Góc cao hoặc sơ đồ mặt bằng nếu có, để xác định độ sâu và cách tổ chức khối.
6. Ảnh cận phần tường, vòm và lan can để tham khảo bề mặt.

Ưu tiên ảnh và tư liệu từ các trang chính thức đã dẫn ở trên. Nếu chỉ có ảnh mặt trước, phần khuất và chiều sâu vòm sẽ cần được ước lượng; cần ghi rõ phần đó là diễn giải khi bàn giao model.

### Phong cách

**Mô hình trưng bày bảo tàng, stylized vừa phải**, giữ silhouette và tỷ lệ nhận diện của di tích nhưng giản lược chi tiết nhỏ để phù hợp với WebGL. Cảm giác như một mô hình kiến trúc được đặt trong ấn phẩm văn hóa đương đại, không phải trình xem sản phẩm hay cảnh game.

Màu và ánh sáng hòa với thiết kế trang: gạch đất nung trầm, nâu đất, màu đá và bụi giấy ngà; ánh sáng ấm, mềm. Có thể giảm bão hòa để model nhập vào nền giấy `#F2EEE5`, nhưng không làm mất cảm giác vật liệu gạch.

### Mức độ chi tiết

- Mục tiêu khoảng **20.000–40.000 triangles**; ưu tiên đường cong năm vòm sạch và silhouette đúng hơn hoa văn dày.
- Tối ưu để tải trên web; hướng tới GLB gọn, lý tưởng dưới khoảng 5 MB nếu chất lượng cho phép.
- Tránh texture độ phân giải lớn. Dùng vật liệu PBR đơn giản, màu gạch và biến thiên bề mặt rất nhẹ.
- Tách các phần chỉ khi cần cho tối ưu hoặc hiệu chỉnh; không chia model thành những mảnh chuyển động giả nếu bản thân công trình không có chuyển động đó.

### Texture và vật liệu

Giữ **màu gạch ấm, hơi trầm**, phù hợp bảng màu nâu–ngà của landing page. Bề mặt có thể có biến thiên nhẹ để tránh cảm giác nhựa, nhưng không dùng vết bẩn hay độ sần quá mạnh. Hạn chế kim loại bóng và phản chiếu.

Nếu cần phiên bản thay thế để hòa vào artwork, có thể làm một biến thể đơn sắc sepia/đất nung. Phiên bản chính vẫn cần đọc được chất liệu kiến trúc gạch.

### Animation riêng của model

Không cần animation nội tại như cửa tự mở, công trình bung lớp hoặc biến hình. Model đứng yên về mặt rig; chuyển động được tạo bởi **camera và model theo tiến độ cuộn trang**. Khi người dùng ngừng cuộn, cảnh dừng ở đúng tư thế hiện tại.

## 3. Cách model dẫn chuyện khi cuộn trang

Trang hiện có câu chuyện cuộn theo các điểm nhìn/camera, có kéo chuột để xoay bổ sung. Hãy dùng Đoan Môn làm tâm của trải nghiệm: mỗi đoạn cuộn đưa người xem đến một tỷ lệ và góc nhìn mới, rồi hiện một mẩu nội dung cạnh công trình. Chuyển cảnh gợi cảm giác đi sâu qua cổng và xuống các lớp của câu chuyện, thay vì chỉ cho công trình xoay liên tục tại chỗ.

Gợi ý nhịp kể, có thể điều chỉnh theo storyboard hiện có:

1. **Toàn cảnh cổng** — mở chủ đề về sự hình thành của Nhà nước.
2. **Tiến gần mặt cổng và các lối vòm** — giới thiệu khái niệm, bản chất và quyền lực nhà nước theo nội dung học phần.
3. **Di chuyển qua góc bên hoặc chiều sâu công trình** — trình bày các đặc trưng của Nhà nước. Không gán mỗi cửa vòm cho một đặc trưng.
4. **Hạ góc nhìn xuống khối tường và nền cổng** — hiện nội dung về chức năng và hình thức tổ chức.
5. **Lùi ra góc rộng** — khép phần kiến thức bằng các kiểu nhà nước và liên hệ nội dung Việt Nam có trong tài liệu môn học.

Đây là gợi ý ánh xạ nội dung sang nhịp nhìn, không phải tuyên bố lịch sử về ý nghĩa của từng bộ phận Đoan Môn. Câu chữ hiển thị cần tiếp tục bám sát tài liệu môn học, không thêm niên đại, sự kiện hoặc diễn giải lịch sử chưa được nguồn xác nhận.

## 4. Tỷ lệ và quy cách bàn giao

- Giữ tỷ lệ tương quan của Đoan Môn theo ảnh tham khảo; không ép vào hình hộp lập phương.
- Trục đứng là `Y`; đặt mặt đất tại `Y = 0`.
- Đặt tâm footprint gần gốc tọa độ `(0, 0, 0)` để component hiện tại dễ căn giữa và đặt nền.
- Hướng mặt chính về `+Z` để tương thích với hướng nhìn ban đầu của camera trong scene hiện tại.
- Chuẩn hóa chiều cao tổng khoảng **2.8 đơn vị Three.js**, sau đó scale toàn model đồng đều để vừa scene; không kéo riêng chiều ngang hoặc chiều sâu.
- Xuất **GLB** sang `public/models/model.glb` để có thể thay model hiện tại trong `src/components/three/CourseModel.tsx`.
- Dùng tên node dễ hiểu nếu model có nhiều phần, ví dụ `gate_main`, `arch_center`, `arch_left_1`, `arch_left_2`, `arch_right_1`, `arch_right_2`, `upper_wall`.
- Không cần rig, keyframe hay animation nhúng trong GLB.

## 5. Prompt có thể gửi cho người tạo model

> Tạo một model 3D kiến trúc **Đoan Môn, cổng phía Nam của Hoàng thành Thăng Long**, dựa trên các ảnh tham chiếu nhiều góc được cung cấp. Ưu tiên đúng silhouette, chiều ngang, chiều sâu và cấu trúc mặt cổng với năm lối vòm; làm rõ cửa giữa theo tư liệu. Thể hiện hình thái di tích trong ảnh tham khảo, không tự thêm mái, tượng, rồng, cờ, chữ hoặc hoa văn không có căn cứ. Phong cách mô hình trưng bày bảo tàng, stylized vừa phải, chất liệu gạch đất nung trầm và ánh sáng ấm, phù hợp nền giấy ngà của một website văn hóa Việt Nam. Giản lược chi tiết nhỏ để chạy tốt trên web, khoảng 20.000–40.000 triangles, vật liệu PBR nhẹ, không dùng texture lớn. Xuất GLB, trục Y hướng lên, mặt đất ở Y=0, tâm footprint gần gốc tọa độ, mặt chính hướng +Z, chiều cao chuẩn hóa khoảng 2.8 đơn vị và giữ nguyên tỷ lệ công trình. Không thêm rig hay animation nội tại; chuyển động sẽ do scroll/camera trong website điều khiển.

## 6. Lưu ý tích hợp với trải nghiệm hiện tại

- Model là placeholder kiến trúc chính của trang cho tới khi có GLB thật; không trình bày ba trụ đá như mô hình cuối.
- Tiếp tục điều khiển camera, góc nhìn, khoảng cách và chuyển động bằng scroll progress/GSAP ScrollTrigger như kiến trúc scene hiện tại.
- Giữ canvas trong suốt, ánh sáng dịu, bóng tiếp xúc nhẹ và giới hạn DPR theo cấu hình hiện có.
- Các đoạn chữ cạnh model giải thích nội dung MLN111; không đặt nhãn kiến trúc lên từng cửa nếu không có lý do từ tư liệu.
- Tôn trọng `prefers-reduced-motion`: giảm dịch chuyển và xoay lớn, đồng thời cho phép đọc đầy đủ nội dung.
- Ảnh hero tiếp tục là nguồn cảm hứng màu và bố cục cho toàn trang, không được xem là bản vẽ kỹ thuật hay ảnh tham chiếu đủ góc của Đoan Môn.

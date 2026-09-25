import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function VietnamContext() {
  return (
    <section id="viet-nam" className="vietnam section-shell" aria-labelledby="vietnam-heading">
      <Reveal><SectionLabel number="07">Liên hệ Việt Nam</SectionLabel></Reveal>
      <div className="vietnam-layout"><Reveal><p className="source-tag">Theo giáo trình 2019</p><h2 id="vietnam-heading">Nhà nước pháp quyền<br /><em>xã hội chủ nghĩa.</em></h2><p className="vietnam-intro">Từ khái quát lịch sử, giáo trình chuyển sang định hướng xây dựng Nhà nước pháp quyền xã hội chủ nghĩa ở Việt Nam.</p></Reveal>
        <Reveal className="vietnam-principles"><p className="eyebrow muted">Nguyên tắc được nhấn mạnh</p><p className="principle">Đảng lãnh đạo.<br />Nhà nước quản lý.<br /><em>Nhân dân làm chủ.</em></p><p className="vietnam-focus">Dân chủ và pháp quyền; cải cách hành chính, tinh gọn bộ máy; công khai, minh bạch; phòng, chống tham nhũng và lãng phí.</p></Reveal>
      </div>
      <Reveal><p className="source-note">Nội dung được trình bày theo tài liệu học tập năm 2019, không phải bản cập nhật chính sách hoặc pháp luật hiện hành.</p></Reveal>
    </section>
  );
}

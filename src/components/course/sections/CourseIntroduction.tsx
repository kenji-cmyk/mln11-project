import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function CourseIntroduction() {
  return (
    <section id="noi-dung" className="introduction section-shell" aria-labelledby="intro-heading">
      <Reveal><SectionLabel number="01">Câu hỏi mở đầu</SectionLabel></Reveal>
      <div className="intro-layout">
        <Reveal><h2 id="intro-heading">Vì sao xã hội<br />cần một <em>nhà nước?</em></h2></Reveal>
        <Reveal className="intro-aside"><p>Nếu cộng đồng ban đầu có thể tự quản, điều gì khiến xã hội cần đến một bộ máy quyền lực đặc biệt?</p><p className="muted">Bắt đầu từ lịch sử hình thành để hiểu nguồn gốc, bản chất và cách nhà nước vận hành — theo cách lý giải của chủ nghĩa Mác - Lênin.</p><a className="text-link" href="#nguon-goc">Đi từ câu hỏi đầu tiên <span aria-hidden="true">↘</span></a></Reveal>
      </div>
    </section>
  );
}

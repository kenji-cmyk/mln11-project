import { stateTypes } from "@/lib/content/course-content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function CourseJourney() {
  return (
    <section id="hanh-trinh" className="journey section-shell" aria-labelledby="journey-heading">
      <Reveal><SectionLabel number="06">Kiểu & hình thức</SectionLabel></Reveal>
      <Reveal className="section-heading-row"><h2 id="journey-heading">Quyền lực thay đổi.<br /><em>Lịch sử tiếp diễn.</em></h2><p className="side-note">Các kiểu nhà nước theo cách phân loại trong giáo trình.</p></Reveal>
      <ol className="history-line">{stateTypes.map((type) => <li key={type.title}><Reveal><span className="roman-number" aria-hidden="true">{type.number}</span><div className="history-dot" aria-hidden="true" /><h3>{type.title}</h3><p>{type.text}</p></Reveal></li>)}</ol>
      <Reveal><div className="distinction"><p className="eyebrow">Phân biệt để hiểu đúng</p><p><strong>Kiểu nhà nước</strong> nói về cơ sở giai cấp và điều kiện kinh tế – xã hội.<br /><strong>Hình thức nhà nước</strong> nói về cách tổ chức và thực hiện quyền lực.</p><span className="distinction-end">Một kiểu.<br /><em>Nhiều hình thức.</em></span></div></Reveal>
    </section>
  );
}

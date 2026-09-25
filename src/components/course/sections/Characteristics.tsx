import { characteristics } from "@/lib/content/course-content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Characteristics() {
  return (
    <section id="dac-trung" className="characteristics section-shell" aria-labelledby="characteristics-heading">
      <Reveal><SectionLabel number="04">Đặc trưng</SectionLabel></Reveal>
      <Reveal className="section-heading-row"><h2 id="characteristics-heading">Ba dấu hiệu.<br /><em>Một thiết chế.</em></h2><p className="side-note">Điều gì phân biệt nhà nước với những hình thức cộng đồng xã hội khác?</p></Reveal>
      <div className="characteristic-list">{characteristics.map((item, index) => <Reveal key={item.name}><article className="characteristic-row"><span className="large-number" aria-hidden="true">0{index + 1}</span><div className="characteristic-title"><p className="eyebrow muted">{item.sub}</p><h3>{item.name}</h3></div><div><p>{item.description}</p><p className="characteristic-detail">{item.detail}</p></div></article></Reveal>)}</div>
    </section>
  );
}

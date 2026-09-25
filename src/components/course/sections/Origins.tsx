import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const steps = [
  ["Lực lượng sản xuất", "Sản xuất phát triển, xuất hiện của cải dư thừa tương đối."],
  ["Tư hữu & phân hóa", "Chế độ tư hữu hình thành, xã hội phân hóa thành các giai cấp."],
  ["Mâu thuẫn giai cấp", "Lợi ích đối lập; cơ chế tự quản cũ không còn đủ sức điều hòa."],
  ["Nhà nước ra đời", "Một bộ máy quyền lực công cộng chuyên biệt xuất hiện."],
];

export function Origins() {
  return (
    <section id="nguon-goc" className="origins section-shell" aria-labelledby="origins-heading">
      <Reveal><SectionLabel number="02">Nguồn gốc</SectionLabel></Reveal>
      <Reveal className="section-heading-row"><h2 id="origins-heading">Từ cộng đồng tự quản<br />đến <em>quyền lực nhà nước.</em></h2><p className="side-note">Nhà nước xuất hiện trong những điều kiện kinh tế – xã hội nhất định.</p></Reveal>
      <ol className="origin-sequence">{steps.map(([title, body], index) => <li key={title}><Reveal><div className="step-marker"><span>0{index + 1}</span><span aria-hidden="true">{index === 3 ? "●" : "→"}</span></div><h3>{title}</h3><p>{body}</p></Reveal></li>)}</ol>
    </section>
  );
}

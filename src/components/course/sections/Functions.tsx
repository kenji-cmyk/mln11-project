"use client";

import { useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const perspectives = [
  {
    label: "Bản chất hoạt động", left: "Thống trị chính trị", right: "Chức năng xã hội",
    leftCopy: "Sử dụng bộ máy quyền lực, chính sách và pháp luật để duy trì trật tự theo lợi ích của giai cấp thống trị.",
    rightCopy: "Tổ chức những công việc chung: giao thông, y tế, giáo dục, môi trường và đời sống xã hội.",
    note: "Chức năng thống trị chính trị giữ vai trò định hướng; chức năng xã hội tạo điều kiện cho sự tồn tại và ổn định của nhà nước.",
  },
  {
    label: "Phạm vi hoạt động", left: "Đối nội", right: "Đối ngoại",
    leftCopy: "Tổ chức và quản lý các lĩnh vực trong nước: chính trị, kinh tế, xã hội, y tế, giáo dục và văn hóa.",
    rightCopy: "Quan hệ với các chủ thể bên ngoài, bảo vệ lợi ích quốc gia, tham gia trao đổi và hợp tác quốc tế.",
    note: "Đối nội và đối ngoại tác động qua lại. Mỗi chức năng đều có thể chứa cả nội dung chính trị và xã hội.",
  },
];

export function Functions() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const item = perspectives[active];
  return (
    <section id="chuc-nang" className="functions section-shell" aria-labelledby="functions-heading">
      <Reveal><SectionLabel number="05">Chức năng</SectionLabel></Reveal>
      <div className="functions-layout">
        <Reveal><h2 id="functions-heading">Duy trì trật tự.<br /><em>Tổ chức xã hội.</em></h2><p className="functions-intro">Hai cách nhìn song song để hiểu nhà nước làm gì và hoạt động trong phạm vi nào.</p>
          <div className="perspective-tabs" role="tablist" aria-label="Cách phân loại chức năng" onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - active;
            setActive(next); buttons.current[next]?.focus();
          }}>{perspectives.map((p, index) => <button key={p.label} ref={(element) => { buttons.current[index] = element; }} role="tab" id={`function-tab-${index}`} aria-selected={active === index} aria-controls="function-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)}><span>0{index + 1}</span>{p.label}<span aria-hidden="true">↗</span></button>)}</div>
        </Reveal>
        <Reveal><div id="function-panel" role="tabpanel" aria-labelledby={`function-tab-${active}`} tabIndex={0} className="function-panel"><p className="eyebrow muted">{item.label}</p><div className="function-pair"><div><h3>{item.left}</h3><p>{item.leftCopy}</p></div><span className="relation-symbol" aria-hidden="true">↔</span><div><h3>{item.right}</h3><p>{item.rightCopy}</p></div></div><p className="function-note">{item.note}</p></div></Reveal>
      </div>
    </section>
  );
}

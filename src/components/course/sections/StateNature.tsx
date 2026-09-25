import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function StateNature() {
  return (
    <section className="nature-band" id="ban-chat" aria-labelledby="nature-heading">
      <div className="nature-inner section-shell">
        <Reveal><SectionLabel number="03">Bản chất</SectionLabel></Reveal>
        <div className="nature-layout">
          <Reveal className="nature-claim">
            <p className="eyebrow">Luận điểm trung tâm</p>
            <h2 id="nature-heading">Quyền lực nhà nước mang dấu ấn <em>giai cấp.</em></h2>
          </Reveal>
          <Reveal className="nature-explanation">
            <p className="nature-lead">Theo giáo trình, nhà nước là tổ chức chính trị gắn với giai cấp thống trị về kinh tế.</p>
            <p>Thông qua bộ máy quyền lực, nhà nước duy trì trật tự xã hội hiện hành và xử lý sự phản kháng của các lực lượng đối lập. Đây là cách tiếp cận lý luận của chủ nghĩa Mác – Lênin về bản chất nhà nước.</p>
            <div className="nature-axis" aria-label="Mối liên hệ giữa lợi ích giai cấp, quyền lực và trật tự xã hội">
              <span>Lợi ích giai cấp</span><span aria-hidden="true">→</span><span>Quyền lực nhà nước</span><span aria-hidden="true">→</span><span>Trật tự hiện hành</span>
            </div>
            <p className="nature-caveat">Trong một số thời kỳ, tương quan lực lượng gần cân bằng có thể tạo cho bộ máy nhà nước mức độ độc lập tương đối. Điều đó không xóa bỏ luận điểm về bản chất giai cấp.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

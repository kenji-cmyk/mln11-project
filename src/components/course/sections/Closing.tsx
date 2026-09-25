import { discussion } from "@/lib/content/course-content";
import { Reveal } from "@/components/ui/Reveal";

export function Closing() {
  return (
    <>
      <section className="discussion section-shell" aria-labelledby="discussion-heading"><Reveal><div className="discussion-heading"><p className="eyebrow muted">Để tiếp tục suy ngẫm</p><h2 id="discussion-heading">Từ hiểu đến <em>đối thoại.</em></h2></div></Reveal><div className="discussion-list">{discussion.map((item, index) => <Reveal key={item.question}><details><summary><span className="question-number">0{index + 1}</span><span>{item.question}</span><span className="expand-icon" aria-hidden="true" /></summary><p>{item.answer}</p></details></Reveal>)}</div></section>
      <footer className="site-footer section-shell"><Reveal><p className="eyebrow">MLN111 / Nhóm thuyết trình 7</p><p className="closing-statement">Hiểu nhà nước<br />trong <em>sự vận động của lịch sử.</em></p><nav className="closing-keywords" aria-label="Năm từ khóa tổng kết"><a href="#nguon-goc">Nguồn gốc</a><span>·</span><a href="#ban-chat">Bản chất</a><span>·</span><a href="#dac-trung">Đặc trưng</a><span>·</span><a href="#chuc-nang">Chức năng</a><span>·</span><a href="#hanh-trinh">Hình thức</a></nav></Reveal><div className="footer-bottom"><p>Nguồn: Giáo trình Triết học Mác - Lênin (2019), mục “Nhà nước”, tr. 212–223.<br />Biên soạn từ tài liệu tóm tắt MLN111 · Phục vụ học tập và thuyết trình.</p><a href="#dau-trang">Về đầu trang <span aria-hidden="true">↑</span></a></div></footer>
    </>
  );
}

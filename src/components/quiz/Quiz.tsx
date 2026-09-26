"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { examQuestions, type ExamQuestion, type ExamSet } from "@/lib/content/exam-content";

type Mode = "exam" | "practice";
type Source = ExamSet | "random";
type Stage = "setup" | "running" | "result";
type ResultTone = "focus" | "building" | "steady" | "strong" | "excellent";

const names: Record<ExamSet, string> = { c1: "Đề C1 FE", c2: "Đề C2 FE", re: "Đề FE RE" };
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const hour = 60 * 60 * 1000;

const resultMessages: Array<{
  min: number;
  max: number;
  tone: ResultTone;
  title: string;
  message: string;
  action: string;
}> = [
  {
    min: 0,
    max: 39,
    tone: "focus",
    title: "Bắt đầu từ những ý cốt lõi",
    message: "Kết quả cho thấy một số khái niệm nền tảng vẫn cần được củng cố. Mỗi câu chưa đúng giúp bạn biết chính xác mình nên tập trung vào đâu.",
    action: "Xem câu sai và đọc phần giải thích, sau đó thử lại bộ đề này.",
  },
  {
    min: 40,
    max: 59,
    tone: "building",
    title: "Bạn đã có điểm tựa để tiến bộ",
    message: "Bạn đã nhận ra nhiều ý quan trọng. Ôn lại các câu còn nhầm lẫn sẽ giúp kiến thức trở nên chắc chắn hơn.",
    action: "Bắt đầu với các câu sai hoặc bỏ trống ở phần xem lại bên dưới.",
  },
  {
    min: 60,
    max: 79,
    tone: "steady",
    title: "Bạn đã nắm được phần lớn nội dung",
    message: "Nền tảng của bạn đang khá vững. Hãy dành thêm thời gian cho những câu chưa đúng để hiểu sâu hơn các khái niệm liên quan.",
    action: "Đọc lời giải của từng câu cần xem lại và tự trả lời lại trước khi chuyển câu.",
  },
  {
    min: 80,
    max: 94,
    tone: "strong",
    title: "Một bài làm rất vững",
    message: "Bạn xử lý tốt phần lớn câu hỏi và đang ở trạng thái sẵn sàng. Một lượt xem lại ngắn sẽ giúp hạn chế những nhầm lẫn còn sót.",
    action: "Kiểm tra các câu sai và những câu bạn còn phân vân.",
  },
  {
    min: 95,
    max: 100,
    tone: "excellent",
    title: "Bạn đã nắm rất chắc bộ câu hỏi này",
    message: "Độ chính xác rất cao cho thấy bạn đã hiểu tốt các nội dung trong lượt làm này. Hãy giữ nhịp ôn tập và thử một bộ đề khác để mở rộng kiến thức.",
    action: "Xem lại bài làm hoặc chọn bộ đề khác để tiếp tục luyện tập.",
  },
];

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function randomQuestions(pool: ExamQuestion[], count: number) {
  const unique: ExamQuestion[] = [];
  const duplicates: ExamQuestion[] = [];
  const seen = new Set<string>();
  for (const item of shuffle(pool)) {
    const key = item.question.trim().toLocaleLowerCase("vi");
    if (seen.has(key)) duplicates.push(item);
    else {
      seen.add(key);
      unique.push(item);
    }
  }
  return [...unique, ...duplicates].slice(0, count);
}

function correct(chosen: number[], answers: number[]) {
  return chosen.length === answers.length && chosen.every((index) => answers.includes(index));
}

function timeLabel(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function elapsedLabel(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function Quiz() {
  const [mode, setMode] = useState<Mode>("exam");
  const [source, setSource] = useState<Source>("c1");
  const [count, setCount] = useState(20);
  const [stage, setStage] = useState<Stage>("setup");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [position, setPosition] = useState(0);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(hour);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (stage !== "running" || mode !== "exam" || deadline === null) return;
    const tick = () => {
      const left = Math.max(0, deadline - Date.now());
      setRemaining(left);
      if (left === 0) {
        setTimedOut(true);
        setFinishedAt((current) => current ?? Date.now());
        setStage("result");
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [deadline, mode, stage]);

  const question = questions[position];
  const chosen = question ? answers[question.id] ?? [] : [];
  const revealed = question && (stage === "result" || (mode === "practice" && checked[question.id]));
  const answeredCount = questions.filter((item) => (answers[item.id]?.length ?? 0) > 0).length;
  const correctCount = questions.filter((item) => correct(answers[item.id] ?? [], item.answers)).length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);
  const incorrectCount = Math.max(0, answeredCount - correctCount);
  const percent = questions.length ? Math.round(100 * correctCount / questions.length) : 0;
  const completionPercent = questions.length ? Math.round(100 * answeredCount / questions.length) : 0;
  const accuracyPercent = answeredCount ? Math.round(100 * correctCount / answeredCount) : 0;
  const elapsed = startedAt === null ? 0 : Math.max(0, (finishedAt ?? Date.now()) - startedAt);
  const resultMessage = resultMessages.find((item) => percent >= item.min && percent <= item.max)
    ?? resultMessages[resultMessages.length - 1];
  const resultContext = unansweredCount > 0
    ? timedOut
      ? `Đã hết giờ khi còn ${unansweredCount} câu chưa trả lời. Hãy xem lại cả những câu này để không bỏ lỡ phần kiến thức liên quan.`
      : `Bạn còn ${unansweredCount} câu bỏ trống. Thử tự trả lời lại trước khi đọc đáp án để ghi nhớ tốt hơn.`
    : incorrectCount > 0
      ? `${incorrectCount} câu trả lời chưa chính xác đã được đánh dấu trong bản đồ câu hỏi.`
      : "Không có câu sai hoặc bỏ trống trong lượt làm này. Bạn có thể xem lại đáp án hoặc thử bộ đề khác.";
  const setBreakdown = (["c1", "c2", "re"] as ExamSet[])
    .map((set) => {
      const items = questions.filter((item) => item.set === set);
      const right = items.filter((item) => correct(answers[item.id] ?? [], item.answers)).length;
      const answered = items.filter((item) => (answers[item.id]?.length ?? 0) > 0).length;
      return {
        set,
        total: items.length,
        right,
        wrong: answered - right,
        unanswered: items.length - answered,
        percent: items.length ? Math.round(100 * right / items.length) : 0,
      };
    })
    .filter((item) => item.total > 0);

  function start() {
    const pool = source === "random" ? examQuestions : examQuestions.filter((item) => item.set === source);
    const selected = source === "random"
      ? randomQuestions(pool, mode === "exam" ? 60 : Math.min(Math.max(1, count), pool.length))
      : [...pool].sort((a, b) => a.number - b.number);
    const now = Date.now();
    setQuestions(selected);
    setAnswers({});
    setChecked({});
    setPosition(0);
    setTimedOut(false);
    setStartedAt(now);
    setFinishedAt(null);
    setDeadline(mode === "exam" ? now + hour : null);
    setRemaining(hour);
    setStage("running");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function select(index: number) {
    if (!question || revealed) return;
    const multiple = question.answers.length > 1;
    setAnswers((current) => ({ ...current, [question.id]: multiple
      ? chosen.includes(index) ? chosen.filter((value) => value !== index) : [...chosen, index]
      : [index] }));
    if (mode === "practice" && !multiple) setChecked((current) => ({ ...current, [question.id]: true }));
  }

  function finish() {
    if (mode === "exam" && answeredCount < questions.length && !window.confirm(`Bạn còn ${questions.length - answeredCount} câu chưa trả lời. Nộp bài ngay?`)) return;
    setFinishedAt(Date.now());
    setStage("result");
    setPosition(0);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function reset() {
    setStage("setup");
    setQuestions([]);
    setDeadline(null);
    setStartedAt(null);
    setFinishedAt(null);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function openReview() {
    const firstToReview = questions.findIndex((item) => !correct(answers[item.id] ?? [], item.answers));
    setPosition(firstToReview >= 0 ? firstToReview : 0);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("quiz-review")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  return <main id="noi-dung" className="quiz-page">
    <header className="quiz-header">
      <Link className="quiz-wordmark" href="/#dau-trang" aria-label="MLN111 — về trang chủ">MLN<span>111</span><span aria-hidden="true" /></Link>
      <Link className="quiz-back-link" href="/#noi-dung"><span aria-hidden="true">←</span> Về hành trình</Link>
    </header>

    {stage === "setup" ? <>
      <section className="quiz-intro">
        <p className="eyebrow"><span className="quiz-kicker-dot" /> MLN111 · Bộ câu hỏi FE</p>
        <h1>Ôn tập để hiểu.<br /><em>Thi thử để sẵn sàng.</em></h1>
        <p>Ba bộ đề, 180 câu hỏi. Chọn cách học phù hợp với bạn.</p>
      </section>
      <section className="quiz-setup" aria-label="Thiết lập bài làm">
        <div className="quiz-setup-group"><h2>01 <span>Chọn chế độ</span></h2>
          <div className="quiz-card-grid">
            <button type="button" className={`quiz-choice-card ${mode === "exam" ? "active" : ""}`} onClick={() => setMode("exam")} aria-pressed={mode === "exam"}><strong>Thi thử</strong><span>60 câu · 60 phút · Xem kết quả khi nộp bài</span></button>
            <button type="button" className={`quiz-choice-card ${mode === "practice" ? "active" : ""}`} onClick={() => setMode("practice")} aria-pressed={mode === "practice"}><strong>Ôn tập</strong><span>Không giới hạn thời gian · Giải thích sau mỗi câu</span></button>
          </div>
        </div>
        <div className="quiz-setup-group"><h2>02 <span>Chọn nguồn câu hỏi</span></h2>
          <div className="quiz-source-grid">{(["c1", "c2", "re", "random"] as const).map((value) => <button type="button" key={value} className={`quiz-source-card ${source === value ? "active" : ""}`} onClick={() => setSource(value)} aria-pressed={source === value}><strong>{value === "random" ? "Ngẫu nhiên" : names[value]}</strong><span>{value === "random" ? "Trộn từ cả 3 đề" : "60 câu hỏi"}</span></button>)}</div>
        </div>
        {mode === "practice" && source === "random" && <div className="quiz-setup-group"><h2>03 <span>Số câu ôn tập</span></h2><label className="quiz-count-input">Chọn từ 1 đến 180 câu<input type="number" min={1} max={180} value={count} onChange={(event) => setCount(Number(event.target.value))} onBlur={() => setCount((value) => Math.min(180, Math.max(1, value || 1)))} /></label></div>}
        <button type="button" className="quiz-primary" onClick={start}>Bắt đầu {mode === "exam" ? "thi thử" : "ôn tập"} <span aria-hidden="true">↗</span></button>
      </section>
    </> : <>
      <section className="quiz-session-head"><div><p className="eyebrow">{mode === "exam" ? "Thi thử" : "Ôn tập"} · {source === "random" ? "Trộn 3 đề" : names[source]}</p><h1>{stage === "result" ? mode === "exam" ? "Kết quả thi thử." : "Tổng kết ôn tập." : `Câu ${String(position + 1).padStart(2, "0")} / ${questions.length}`}</h1><p>{stage === "result" ? `${correctCount} đúng · ${incorrectCount} sai · ${unansweredCount} bỏ trống` : `${answeredCount} / ${questions.length} câu đã trả lời`}</p><div className="quiz-progress" role="progressbar" aria-label="Tiến độ trả lời" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answeredCount}><span style={{ transform: `scaleX(${questions.length ? answeredCount / questions.length : 0})` }} /></div></div>
        {mode === "exam" && stage === "running" && <div className={`quiz-timer ${remaining <= 5 * 60 * 1000 ? "urgent" : ""}`}><span>Thời gian còn lại</span><strong>{timeLabel(remaining)}</strong></div>}
      </section>

      {stage === "result" && <>
        <section className={`quiz-result ${resultMessage.tone}`} aria-labelledby="quiz-result-title">
          <div className="quiz-result-copy">
            <p className="eyebrow"><span className="quiz-kicker-dot" /> Tổng kết bài làm</p>
            <h2 id="quiz-result-title">{resultMessage.title}</h2>
            <p className="quiz-result-message" role="status">{resultMessage.message}</p>
            <p className="quiz-result-action">{resultMessage.action}</p>
            <p className="quiz-result-context">{resultContext}</p>
            <button type="button" className="quiz-result-review" onClick={openReview}>{incorrectCount + unansweredCount > 0 ? "Xem lại câu cần cải thiện" : "Xem lại đáp án"}<span aria-hidden="true">↓</span></button>
          </div>
          <div className="quiz-score-ring" role="img" aria-label={`Điểm ${correctCount} trên ${questions.length}, tương đương ${percent}%`} style={{ background: `conic-gradient(var(--accent) ${percent}%, var(--line) 0)` }}>
            <div className="quiz-score-ring-center"><span className="quiz-score-ring-value">{percent}<small>%</small></span><span className="quiz-score-ring-label">{correctCount} / {questions.length} câu đúng</span></div>
          </div>
        </section>

        <section className="quiz-result-stats" aria-label="Các chỉ số bài làm">
          {[
            { label: "Câu đúng", value: String(correctCount), detail: `trên ${questions.length} câu`, tone: "correct" },
            { label: "Câu sai", value: String(incorrectCount), detail: "đã trả lời nhưng chưa chính xác", tone: "incorrect" },
            { label: "Bỏ trống", value: String(unansweredCount), detail: "câu chưa có lựa chọn", tone: "unanswered" },
            { label: "Đã hoàn thành", value: `${answeredCount} / ${questions.length}`, detail: `${completionPercent}% số câu đã trả lời`, tone: "neutral" },
            { label: "Độ chính xác", value: answeredCount ? `${accuracyPercent}%` : "—", detail: answeredCount ? `${correctCount} / ${answeredCount} câu đã làm` : "Chưa có câu trả lời", tone: "neutral" },
            { label: "Thời gian làm", value: elapsedLabel(elapsed), detail: mode === "exam" ? timedOut ? "đã hết 60 phút" : `${timeLabel(remaining)} còn lại` : "tổng thời gian ôn tập", tone: "neutral" },
          ].map((stat) => <article className={`quiz-result-stat ${stat.tone}`} key={stat.label}>
            <span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.detail}</small>
          </article>)}
        </section>

        <section className="quiz-result-breakdown" aria-labelledby="quiz-breakdown-title">
          <div className="quiz-result-section-head"><div><p className="eyebrow">01 · Theo nguồn câu hỏi</p><h2 id="quiz-breakdown-title">Kết quả theo bộ đề</h2></div><p>So sánh số câu đúng giữa các phần để biết mình nên dành thời gian ôn ở đâu.</p></div>
          <div className="quiz-set-grid">{setBreakdown.map((item) => <article className="quiz-set-card" key={item.set}>
            <div className="quiz-set-card-head"><h3>{names[item.set]}</h3><strong>{item.percent}%</strong></div>
            <div className="quiz-set-progress" role="progressbar" aria-label={`Kết quả ${names[item.set]}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.percent}><span style={{ transform: `scaleX(${item.percent / 100})` }} /></div>
            <div className="quiz-set-card-stats"><span>{item.right} / {item.total} đúng</span><span>{item.wrong} sai</span><span>{item.unanswered} trống</span></div>
          </article>)}</div>
        </section>

        <section className="quiz-review-intro" id="quiz-review" aria-labelledby="quiz-review-title">
          <div><p className="eyebrow">02 · Xem lại từng câu</p><h2 id="quiz-review-title">Biến câu sai thành kinh nghiệm.</h2></div>
          <p>Chọn một số trong bản đồ để xem câu trả lời, đáp án đúng và phần giải thích. Các câu bỏ trống cũng được mở lời giải.</p>
          <div className="quiz-review-legend" aria-label="Chú giải trạng thái câu hỏi"><span className="correct">Đúng</span><span className="incorrect">Sai</span><span className="unanswered">Bỏ trống</span></div>
        </section>
      </>}

      {question && <div className={`quiz-workspace ${stage === "result" ? "is-review" : ""}`}><nav className="quiz-question-nav" aria-label={stage === "result" ? "Bản đồ kết quả câu hỏi" : "Chọn câu hỏi"}>{questions.map((item, index) => {
        const response = answers[item.id] ?? [];
        const status = stage !== "result" ? response.length ? "answered" : "" : response.length === 0 ? "unanswered" : correct(response, item.answers) ? "correct" : "incorrect";
        const statusLabel = status === "correct" ? "đúng" : status === "incorrect" ? "sai" : status === "unanswered" ? "bỏ trống" : status === "answered" ? "đã trả lời" : "chưa trả lời";
        return <button type="button" key={item.id} className={`${index === position ? "current" : ""} ${status}`} onClick={() => setPosition(index)} aria-label={`Câu ${index + 1}, ${statusLabel}`} aria-current={index === position ? "step" : undefined}>{index + 1}</button>;
      })}</nav>
        <section key={`${question.id}-${stage}`} className="quiz-question-panel" aria-label={`Câu hỏi ${position + 1}`}><div className="quiz-question-meta"><span>{names[question.set]} · Câu gốc {question.number}</span><span>{question.answers.length > 1 ? "Chọn nhiều đáp án" : "Chọn một đáp án"}</span></div><h2>{question.question}</h2>
          <div className="quiz-options">{question.choices.map((choice, index) => <button type="button" key={index} className={`quiz-option ${chosen.includes(index) ? "is-selected" : ""} ${revealed && question.answers.includes(index) ? "is-answer" : ""} ${revealed && chosen.includes(index) && !question.answers.includes(index) ? "is-wrong" : ""}`} onClick={() => select(index)} disabled={Boolean(revealed)} aria-pressed={chosen.includes(index)}><span className="option-letter">{letters[index]}</span><span className="option-copy">{choice}</span>{revealed && question.answers.includes(index) && <span className="option-status">Đáp án đúng</span>}</button>)}</div>
          {mode === "practice" && question.answers.length > 1 && !revealed && <button type="button" className="quiz-check" disabled={!chosen.length} onClick={() => setChecked((current) => ({ ...current, [question.id]: true }))}>Kiểm tra câu này</button>}
          {revealed && <div className={`quiz-feedback ${correct(chosen, question.answers) ? "correct" : "incorrect"}`} role="status"><strong>{chosen.length === 0 ? "Chưa trả lời" : correct(chosen, question.answers) ? "Chính xác" : "Chưa đúng"}</strong>{chosen.length === 0 && <p>Câu này đang bỏ trống. Đọc đáp án và lời giải để củng cố phần kiến thức liên quan.</p>}<p>{question.explanation}</p></div>}
          <div className="quiz-navigation"><button type="button" onClick={() => setPosition((value) => Math.max(0, value - 1))} disabled={position === 0}>← Câu trước</button><button type="button" onClick={() => setPosition((value) => Math.min(questions.length - 1, value + 1))} disabled={position === questions.length - 1}>Câu tiếp →</button></div>
        </section></div>}
      <div className="quiz-session-actions">{stage === "running" ? <button className="quiz-primary" type="button" onClick={finish}>{mode === "exam" ? "Nộp bài" : "Kết thúc ôn tập"} <span aria-hidden="true">↗</span></button> : <button className="quiz-primary" type="button" onClick={reset}>Chọn bài khác <span aria-hidden="true">↗</span></button>}</div>
    </>}
    <footer className="quiz-source">Nguồn câu hỏi: ba bộ ảnh MLN111 FE do người học cung cấp. Bản chữ và đáp án được biên tập từ ảnh nhỏ.</footer>
  </main>;
}

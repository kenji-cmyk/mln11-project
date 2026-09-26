"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { examQuestions, type ExamQuestion, type ExamSet } from "@/lib/content/exam-content";

type Mode = "exam" | "practice";
type Source = ExamSet | "random";
type Stage = "setup" | "running" | "result";
const names: Record<ExamSet, string> = { c1: "Đề C1 FE", c2: "Đề C2 FE", re: "Đề FE RE" };
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const hour = 60 * 60 * 1000;

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
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (stage !== "running" || mode !== "exam" || deadline === null) return;
    const tick = () => {
      const left = Math.max(0, deadline - Date.now());
      setRemaining(left);
      if (left === 0) {
        setTimedOut(true);
        setStage("result");
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [deadline, mode, stage]);

  const question = questions[position];
  const chosen = question ? answers[question.id] ?? [] : [];
  const revealed = question && (mode === "exam" ? stage === "result" : checked[question.id]);
  const answeredCount = questions.filter((item) => (answers[item.id]?.length ?? 0) > 0).length;
  const correctCount = questions.filter((item) => correct(answers[item.id] ?? [], item.answers)).length;
  const percent = questions.length ? Math.round(100 * correctCount / questions.length) : 0;

  function start() {
    const pool = source === "random" ? examQuestions : examQuestions.filter((item) => item.set === source);
    const selected = source === "random"
      ? randomQuestions(pool, mode === "exam" ? 60 : Math.min(Math.max(1, count), pool.length))
      : [...pool].sort((a, b) => a.number - b.number);
    setQuestions(selected);
    setAnswers({});
    setChecked({});
    setPosition(0);
    setTimedOut(false);
    setDeadline(mode === "exam" ? Date.now() + hour : null);
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
    setStage("result");
    setPosition(0);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function reset() {
    setStage("setup");
    setQuestions([]);
    setDeadline(null);
    window.scrollTo({ top: 0, behavior: "auto" });
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
      <section className="quiz-session-head"><div><p className="eyebrow">{mode === "exam" ? "Thi thử" : "Ôn tập"} · {source === "random" ? "Trộn 3 đề" : names[source]}</p><h1>{stage === "result" ? mode === "exam" ? "Kết quả bài thi." : "Vòng ôn tập đã xong." : `Câu ${String(position + 1).padStart(2, "0")} / ${questions.length}`}</h1><p>{answeredCount} / {questions.length} câu đã trả lời</p><div className="quiz-progress" role="progressbar" aria-label="Tiến độ trả lời" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answeredCount}><span style={{ transform: `scaleX(${questions.length ? answeredCount / questions.length : 0})` }} /></div></div>
        {mode === "exam" && <div className={`quiz-timer ${remaining <= 5 * 60 * 1000 ? "urgent" : ""}`}><span>Thời gian còn lại</span><strong>{timeLabel(remaining)}</strong></div>}
      </section>
      {stage === "result" && <section className="quiz-result" aria-live="polite"><p className="eyebrow">{timedOut ? "Hết giờ · Bài đã được nộp" : "Đã hoàn thành"}</p><p className="quiz-score">{correctCount}<span> / {questions.length}</span></p><p>Đúng {percent}% · {questions.length - answeredCount} câu bỏ trống</p><p>{percent >= 80 ? "Bạn đã nắm khá vững bộ câu hỏi này." : percent >= 50 ? "Bạn đã có nền tảng; hãy xem lại các câu trả lời chưa đúng." : "Hãy ôn lại đáp án và phần giải thích trước khi thử lần nữa."}</p></section>}
      {question && <div className="quiz-workspace"><nav className="quiz-question-nav" aria-label="Chọn câu hỏi">{questions.map((item, index) => <button type="button" key={item.id} className={`${index === position ? "current" : ""} ${answers[item.id]?.length ? "answered" : ""} ${stage === "result" ? correct(answers[item.id] ?? [], item.answers) ? "correct" : "incorrect" : ""}`} onClick={() => setPosition(index)} aria-label={`Câu ${index + 1}${answers[item.id]?.length ? ", đã trả lời" : ", chưa trả lời"}`} aria-current={index === position ? "step" : undefined}>{index + 1}</button>)}</nav>
        <section key={`${question.id}-${stage}`} className="quiz-question-panel" aria-label={`Câu hỏi ${position + 1}`}><div className="quiz-question-meta"><span>{names[question.set]} · Câu gốc {question.number}</span><span>{question.answers.length > 1 ? "Chọn nhiều đáp án" : "Chọn một đáp án"}</span></div><h2>{question.question}</h2>
          <div className="quiz-options">{question.choices.map((choice, index) => <button type="button" key={index} className={`quiz-option ${chosen.includes(index) ? "is-selected" : ""} ${revealed && question.answers.includes(index) ? "is-answer" : ""} ${revealed && chosen.includes(index) && !question.answers.includes(index) ? "is-wrong" : ""}`} onClick={() => select(index)} disabled={Boolean(revealed)} aria-pressed={chosen.includes(index)}><span className="option-letter">{letters[index]}</span><span className="option-copy">{choice}</span>{revealed && question.answers.includes(index) && <span className="option-status">Đáp án đúng</span>}</button>)}</div>
          {mode === "practice" && question.answers.length > 1 && !revealed && <button type="button" className="quiz-check" disabled={!chosen.length} onClick={() => setChecked((current) => ({ ...current, [question.id]: true }))}>Kiểm tra câu này</button>}
          {revealed && <div className={`quiz-feedback ${correct(chosen, question.answers) ? "correct" : "incorrect"}`} role="status"><strong>{correct(chosen, question.answers) ? "Chính xác" : "Chưa đúng"}</strong><p>{question.explanation}</p></div>}
          <div className="quiz-navigation"><button type="button" onClick={() => setPosition((value) => Math.max(0, value - 1))} disabled={position === 0}>← Câu trước</button><button type="button" onClick={() => setPosition((value) => Math.min(questions.length - 1, value + 1))} disabled={position === questions.length - 1}>Câu tiếp →</button></div>
        </section></div>}
      <div className="quiz-session-actions">{stage === "running" ? <button className="quiz-primary" type="button" onClick={finish}>{mode === "exam" ? "Nộp bài" : "Kết thúc ôn tập"} <span aria-hidden="true">↗</span></button> : <button className="quiz-primary" type="button" onClick={reset}>Chọn bài khác <span aria-hidden="true">↗</span></button>}</div>
    </>}
    <footer className="quiz-source">Nguồn câu hỏi: ba bộ ảnh MLN111 FE do người học cung cấp. Bản chữ và đáp án được biên tập từ ảnh nhỏ.</footer>
  </main>;
}

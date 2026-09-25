"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { quizLetters, quizQuestions } from "@/lib/content/quiz-content";

export function Quiz() {
  const [answers, setAnswers] = useState<Array<number | null>>(() => quizQuestions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [needsAnswers, setNeedsAnswers] = useState(false);
  const firstMissing = useRef<HTMLElement>(null);
  const correctCount = answers.reduce<number>((sum, answer, index) => sum + Number(answer === quizQuestions[index].answer), 0);

  function submitQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missingIndex = answers.findIndex((answer) => answer === null);
    if (missingIndex !== -1) {
      setNeedsAnswers(true);
      document.getElementById(`question-${missingIndex + 1}`)?.scrollIntoView({ behavior: "auto", block: "center" });
      firstMissing.current = document.getElementById(`question-${missingIndex + 1}`);
      firstMissing.current?.focus();
      return;
    }
    setNeedsAnswers(false);
    setSubmitted(true);
  }

  function restartQuiz() {
    setAnswers(quizQuestions.map(() => null));
    setNeedsAnswers(false);
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  return (
    <main id="noi-dung" className="quiz-page">
      <header className="quiz-header">
        <Link className="quiz-wordmark" href="/#dau-trang" aria-label="MLN111 — trở về trang mở đầu">MLN<span>111</span><span aria-hidden="true" /></Link>
        <Link className="quiz-back-link" href="/#noi-dung"><span aria-hidden="true">←</span> Về hành trình</Link>
      </header>
      <section className="quiz-intro" aria-labelledby="quiz-heading">
        <p className="eyebrow"><span className="quiz-kicker-dot" /> MLN111 · Ôn tập kiến thức</p>
        <h1 id="quiz-heading">Năm câu hỏi.<br /><em>Một vòng nhìn lại.</em></h1>
        <p>Nhớ lại những điểm chính về nguồn gốc, bản chất và cách nhà nước vận hành.</p>
        <span className="quiz-count">05 CÂU <span aria-hidden="true">·</span> A—D</span>
      </section>

      <form className="quiz-form" onSubmit={submitQuiz}>
        {quizQuestions.map((item, questionIndex) => {
          const chosen = answers[questionIndex];
          return (
            <fieldset className={`quiz-question ${submitted ? chosen === item.answer ? "is-correct" : "is-incorrect" : ""}`} key={item.question} id={`question-${questionIndex + 1}`} tabIndex={-1}>
              <legend><span className="quiz-question-number">0{questionIndex + 1}</span><span>{item.question}</span></legend>
              <div className="quiz-options">
                {item.choices.map((choice, choiceIndex) => {
                  const isCorrect = submitted && choiceIndex === item.answer;
                  const isWrongSelection = submitted && chosen === choiceIndex && choiceIndex !== item.answer;
                  return <label className={`quiz-option ${chosen === choiceIndex ? "is-selected" : ""} ${isCorrect ? "is-answer" : ""} ${isWrongSelection ? "is-wrong" : ""}`} key={choice}>
                    <input type="radio" name={`question-${questionIndex + 1}`} value={choiceIndex} checked={chosen === choiceIndex} disabled={submitted} onChange={() => setAnswers((current) => current.map((value, index) => index === questionIndex ? choiceIndex : value))} />
                    <span className="option-letter">{quizLetters[choiceIndex]}</span>
                    <span className="option-copy">{choice}</span>
                    {isCorrect && <span className="option-status">Đáp án đúng</span>}
                    {isWrongSelection && <span className="option-status">Bạn đã chọn</span>}
                  </label>;
                })}
              </div>
              {submitted && <p className="quiz-explanation"><span>Ghi nhớ</span>{item.explanation}</p>}
            </fieldset>
          );
        })}

        <div className="quiz-actions">
          {!submitted ? <button className="quiz-submit" type="submit">Kiểm tra đáp án <span aria-hidden="true">↗</span></button> : <button className="quiz-submit" type="button" onClick={restartQuiz}>Làm lại <span aria-hidden="true">↻</span></button>}
          {needsAnswers && <p className="quiz-validation" role="alert">Hãy chọn một đáp án cho cả năm câu trước khi kiểm tra.</p>}
        </div>
      </form>

      {submitted && <section className="quiz-result" aria-live="polite" aria-label="Kết quả ôn tập">
        <p className="eyebrow">Kết quả ôn tập</p>
        <p className="quiz-score">{correctCount}<span> / 5</span></p>
        <p>{correctCount === 5 ? "Nắm vững cả năm điểm chính." : "Xem lại phần giải thích phía trên để nhớ rõ hơn."}</p>
        <button className="quiz-retry" type="button" onClick={restartQuiz}>Thử lại từ đầu <span aria-hidden="true">↗</span></button>
      </section>}

      <footer className="quiz-source">Theo Giáo trình Triết học Mác - Lênin (2019), mục “Nhà nước”, trang 212–223.</footer>
    </main>
  );
}

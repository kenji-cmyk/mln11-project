import { c1Rows } from "./exam-c1";
import { reRows } from "./exam-re";

export type ExamSet = "c1" | "c2" | "re";

export type QuestionRow = [file: number, sourceNumber: number, question: string, choices: string[], answer: number | number[], explanation: string];

export type ExamQuestion = {
  id: string;
  set: ExamSet;
  number: number;
  question: string;
  choices: string[];
  answers: number[];
  explanation: string;
  image: string;
};

function fromRows(set: ExamSet, rows: QuestionRow[]): ExamQuestion[] {
  return rows.map(([file, number, question, choices, answer, explanation]) => ({
    id: `${set}-${number}`,
    set,
    number,
    question,
    choices,
    answers: Array.isArray(answer) ? answer : [answer],
    explanation,
    image: `/exams/${set}/${set === "re" ? "image" : "question"}_${String(file).padStart(3, "0")}.jpg`,
  }));
}

const c2Rows: QuestionRow[] = [...c1Rows]
  .sort((a, b) => a[1] - b[1])
  .map(([, number, question, choices, answer, explanation]) => [number, number, question, choices, answer, explanation]);

export const examQuestions: ExamQuestion[] = [
  ...fromRows("c1", c1Rows),
  ...fromRows("c2", c2Rows),
  ...fromRows("re", reRows),
];

import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";
import "./quiz.css";

export const metadata: Metadata = {
  title: "Thi thử và ôn tập FE · MLN111",
  description: "Thi thử 60 phút hoặc ôn tập theo ba bộ đề MLN111 FE với 180 câu hỏi.",
};

export default function RevisionPage() {
  return <Quiz />;
}

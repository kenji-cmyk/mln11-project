import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";
import "./quiz.css";

export const metadata: Metadata = {
  title: "Ôn tập — Nhà nước · MLN111",
  description: "Năm câu hỏi trắc nghiệm về chuyên đề Nhà nước trong MLN111.",
};

export default function RevisionPage() {
  return <Quiz />;
}

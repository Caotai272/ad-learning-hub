import type { QuizQuestionType } from "@prisma/client";

import { cn } from "@/lib/utils";

type AdminQuizPreviewProps = {
  quiz: {
    title: string;
    description: string | null;
    passingScore: number;
    timeLimitMinutes: number | null;
    maxAttempts: number | null;
    questions: Array<{
      id: string;
      type: QuizQuestionType;
      prompt: string;
      explanation: string | null;
      points: number;
      sortOrder: number;
      choices: Array<{
        id: string;
        label: string;
        value: string | null;
        explanation: string | null;
        isCorrect: boolean;
      }>;
    }>;
  };
};

function getQuestionTypeLabel(type: QuizQuestionType) {
  switch (type) {
    case "SINGLE_CHOICE":
      return "Single choice";
    case "MULTIPLE_CHOICE":
      return "Multiple choice";
    case "TRUE_FALSE":
      return "True / False";
    case "SHORT_TEXT":
      return "Short text";
    default:
      return type;
  }
}

export function AdminQuizPreview({ quiz }: AdminQuizPreviewProps) {
  return (
    <details className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
      <summary className="cursor-pointer list-none text-sm font-semibold text-slate-950">
        Preview quiz
      </summary>

      <div className="mt-5 space-y-5">
        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              Mốc đạt: {quiz.passingScore}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              Giới hạn thời gian: {quiz.timeLimitMinutes ?? "Không giới hạn"}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              Số lượt làm: {quiz.maxAttempts ?? "Không giới hạn"}
            </span>
          </div>

          {quiz.description ? (
            <p className="mt-4 text-sm leading-7 text-slate-600">{quiz.description}</p>
          ) : null}
        </div>

        {quiz.questions.length > 0 ? (
          quiz.questions.map((question, index) => (
            <article
              key={question.id}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Câu {index + 1}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {getQuestionTypeLabel(question.type)}
                </span>
                <span className="text-xs text-slate-500">
                  {question.points} điểm · Sort order: {question.sortOrder}
                </span>
              </div>

              <h4 className="mt-4 text-lg font-semibold text-slate-950">{question.prompt}</h4>

              {question.type === "SHORT_TEXT" ? (
                <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-700">Accepted answers</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {question.choices.length > 0 ? (
                      question.choices.map((choice) => (
                        <span
                          key={choice.id}
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
                        >
                          {choice.label}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">Chưa có đáp án đúng.</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid gap-3">
                  {question.choices.map((choice) => (
                    <div
                      key={choice.id}
                      className={cn(
                        "rounded-[1.25rem] border px-4 py-4 text-sm",
                        choice.isCorrect
                          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                          : "border-slate-200 bg-white text-slate-700",
                      )}
                    >
                      <p className="font-medium">{choice.label}</p>
                      {choice.value ? (
                        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                          Value: {choice.value}
                        </p>
                      ) : null}
                      {choice.explanation ? (
                        <p className="mt-2 leading-6 text-slate-600">{choice.explanation}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

              {question.explanation ? (
                <div className="mt-4 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-950">
                  <span className="font-semibold">Giải thích:</span> {question.explanation}
                </div>
              ) : null}
            </article>
          ))
        ) : (
          <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-sm text-slate-500">
            Quiz này chưa có question để preview.
          </div>
        )}
      </div>
    </details>
  );
}

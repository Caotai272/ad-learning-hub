"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

type QuizPlayerProps = {
  quiz: {
    id: string;
    courseSlug: string;
    passingScore: number;
    questions: Array<{
      id: string;
      prompt: string;
      type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_TEXT";
      explanation: string | null;
      points: number;
      choices: Array<{
        id: string;
        label: string;
        explanation: string | null;
      }>;
    }>;
  };
  isAuthenticated: boolean;
  attemptState: {
    attemptCount: number;
    remainingAttempts: number | null;
    canAttempt: boolean;
    latestAttempt: {
      id: string;
      score: number;
      passed: boolean;
      submittedAt: string | null;
      answers: Array<{
        questionId: string;
        isCorrect: boolean;
        pointsAwarded: number;
        selectedChoiceIds: string[];
        answerText: string | null;
      }>;
    } | null;
  } | null;
};

type AnswerState = Record<
  string,
  {
    selectedChoiceIds: string[];
    answerText: string;
  }
>;

export function QuizPlayer({ quiz, isAuthenticated, attemptState }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<AnswerState>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(attemptState?.attemptCount ?? 0);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(
    attemptState?.remainingAttempts ?? null,
  );
  const [canAttempt, setCanAttempt] = useState(attemptState?.canAttempt ?? isAuthenticated);
  const [result, setResult] = useState(attemptState?.latestAttempt ?? null);
  const [isPending, startTransition] = useTransition();

  const answerResultMap = useMemo(() => {
    return new Map((result?.answers ?? []).map((answer) => [answer.questionId, answer]));
  }, [result]);

  const handleSingleChoiceChange = (questionId: string, choiceId: string) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        selectedChoiceIds: [choiceId],
        answerText: current[questionId]?.answerText ?? "",
      },
    }));
  };

  const handleMultipleChoiceChange = (questionId: string, choiceId: string) => {
    setAnswers((current) => {
      const selectedChoiceIds = current[questionId]?.selectedChoiceIds ?? [];
      const nextSelectedChoiceIds = selectedChoiceIds.includes(choiceId)
        ? selectedChoiceIds.filter((item) => item !== choiceId)
        : [...selectedChoiceIds, choiceId];

      return {
        ...current,
        [questionId]: {
          selectedChoiceIds: nextSelectedChoiceIds,
          answerText: current[questionId]?.answerText ?? "",
        },
      };
    });
  };

  const handleTextAnswerChange = (questionId: string, value: string) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        selectedChoiceIds: current[questionId]?.selectedChoiceIds ?? [],
        answerText: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (!isAuthenticated || !canAttempt) {
      return;
    }

    setServerError(null);

    startTransition(async () => {
      const response = await fetch(`/api/v1/student/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: quiz.questions.map((question) => ({
            questionId: question.id,
            selectedChoiceIds: answers[question.id]?.selectedChoiceIds ?? [],
            answerText: answers[question.id]?.answerText?.trim() || undefined,
          })),
        }),
      });

      const payload = (await response.json()) as {
        data:
          | {
              id: string;
              score: number;
              passed: boolean;
              submittedAt: string | null;
              answers: Array<{
                questionId: string;
                isCorrect: boolean;
                pointsAwarded: number;
                selectedChoiceIds: string[];
                answerText: string | null;
              }>;
              attemptCount: number;
              remainingAttempts: number | null;
              canAttempt: boolean;
            }
          | null;
        error: { message: string } | null;
      };

      if (!response.ok || !payload.data) {
        setServerError(payload.error?.message ?? "Không thể nộp quiz lúc này.");
        return;
      }

      setResult(payload.data);
      setAttemptCount(payload.data.attemptCount);
      setRemainingAttempts(payload.data.remainingAttempts);
      setCanAttempt(payload.data.canAttempt);
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
        <h2 className="text-xl font-semibold text-slate-950">Trạng thái làm quiz</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm text-slate-500">Số lần đã nộp</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{attemptCount}</p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm text-slate-500">Số lần còn lại</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {remainingAttempts === null ? "Không giới hạn" : remainingAttempts}
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm text-slate-500">Mốc đạt</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{quiz.passingScore}</p>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-sky-50 px-5 py-5 text-sm leading-7 text-sky-950">
            Bạn cần đăng nhập trước khi nộp quiz.
            <div className="mt-4">
              <Link
                href="/login"
                className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Đăng nhập để làm quiz
              </Link>
            </div>
          </div>
        ) : null}

        {result ? (
          <div
            className={`mt-5 rounded-[1.25rem] px-5 py-5 text-sm leading-7 ${
              result.passed
                ? "border border-emerald-200 bg-emerald-50 text-emerald-950"
                : "border border-amber-200 bg-amber-50 text-amber-950"
            }`}
          >
            <p className="text-base font-semibold">
              Kết quả gần nhất: {result.score} điểm {result.passed ? "(Đạt)" : "(Chưa đạt)"}
            </p>
            <p className="mt-2">
              {result.submittedAt
                ? `Bài làm đã được chấm và lưu vào hệ thống.`
                : "Bài làm gần nhất đã được lưu."}
            </p>
          </div>
        ) : null}

        {serverError ? <p className="mt-4 text-sm text-rose-600">{serverError}</p> : null}
      </section>

      <section className="grid gap-6">
        {quiz.questions.map((question, index) => {
          const answerResult = answerResultMap.get(question.id);
          const selectedChoiceIds = answers[question.id]?.selectedChoiceIds ?? [];
          const textAnswer = answers[question.id]?.answerText ?? "";

          return (
            <article
              key={question.id}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Câu {index + 1}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">{question.prompt}</h2>
              <p className="mt-2 text-sm text-slate-500">{question.points} điểm</p>

              {question.type === "SHORT_TEXT" ? (
                <textarea
                  value={textAnswer}
                  onChange={(event) => handleTextAnswerChange(question.id, event.target.value)}
                  className="mt-5 min-h-32 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-slate-400"
                  placeholder="Nhập câu trả lời của bạn"
                  disabled={!isAuthenticated || isPending || !canAttempt}
                />
              ) : (
                <div className="mt-6 grid gap-3">
                  {question.choices.map((choice) => {
                    const isSelected = selectedChoiceIds.includes(choice.id);
                    const wasSelected = answerResult?.selectedChoiceIds.includes(choice.id) ?? false;
                    const showSubmittedState = Boolean(result);

                    return (
                      <label
                        key={choice.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-[1.25rem] border px-4 py-4 text-sm transition ${
                          showSubmittedState && wasSelected
                            ? answerResult?.isCorrect
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-rose-200 bg-rose-50"
                            : isSelected
                              ? "border-slate-400 bg-slate-100"
                              : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type={question.type === "MULTIPLE_CHOICE" ? "checkbox" : "radio"}
                          name={question.id}
                          value={choice.id}
                          checked={
                            question.type === "MULTIPLE_CHOICE"
                              ? isSelected
                              : selectedChoiceIds[0] === choice.id
                          }
                          onChange={() =>
                            question.type === "MULTIPLE_CHOICE"
                              ? handleMultipleChoiceChange(question.id, choice.id)
                              : handleSingleChoiceChange(question.id, choice.id)
                          }
                          disabled={!isAuthenticated || isPending || !canAttempt}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium text-slate-900">{choice.label}</p>
                          {showSubmittedState && choice.explanation ? (
                            <p className="mt-2 leading-6 text-slate-600">{choice.explanation}</p>
                          ) : null}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {result && question.explanation ? (
                <div
                  className={`mt-5 rounded-[1.25rem] px-4 py-4 text-sm leading-7 ${
                    answerResult?.isCorrect
                      ? "bg-emerald-50 text-emerald-950"
                      : "bg-amber-50 text-amber-950"
                  }`}
                >
                  <span className="font-semibold">Giải thích:</span> {question.explanation}
                </div>
              ) : null}
            </article>
          );
        })}
      </section>

      {isAuthenticated ? (
        <section className="pb-12">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !canAttempt}
            className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Đang nộp quiz..." : canAttempt ? "Nộp quiz" : "Đã hết lượt làm"}
          </button>
        </section>
      ) : null}
    </div>
  );
}

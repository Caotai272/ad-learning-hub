"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { getPublicButtonClassName } from "@/components/ui/public-button";
import { getLevelLabel, getPlatformLabel } from "@/lib/learning";
import type { PracticeScenario, PracticeScenarioAttempt } from "@/modules/practice/practice.types";

type PracticeSimulatorProps = {
  scenario: PracticeScenario;
  initialAttempts: PracticeScenarioAttempt[];
  isAuthenticated: boolean;
};

type PracticeSubmitResponse = {
  data: PracticeScenarioAttempt | null;
  error: {
    code: string;
    message: string;
  } | null;
};

export function PracticeSimulator({
  scenario,
  initialAttempts,
  isAuthenticated,
}: PracticeSimulatorProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<PracticeScenarioAttempt[]>(initialAttempts);
  const [result, setResult] = useState<PracticeScenarioAttempt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => value.trim()).length,
    [answers],
  );
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((attempt) => attempt.score)) : 0;

  async function handleSubmit() {
    if (answeredCount < scenario.questions.length) {
      return;
    }

    if (!isAuthenticated) {
      setSubmitError("Bạn cần đăng nhập để nộp simulator và lưu lịch sử practice.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`/api/v1/student/practice/${scenario.slug}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: scenario.questions.map((question) => ({
            questionId: question.id,
            selectedOptionId: answers[question.id],
          })),
        }),
      });

      const payload = (await response.json()) as PracticeSubmitResponse;

      if (!response.ok || !payload.data) {
        throw new Error(payload.error?.message ?? "Không thể nộp practice simulator lúc này.");
      }

      setAttempts((current) => [payload.data!, ...current].slice(0, 8));
      setResult(payload.data);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Không thể nộp practice simulator lúc này.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {getPlatformLabel(scenario.platform)}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {getLevelLabel(scenario.difficulty)}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {scenario.durationMinutes} phút
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            Mốc đạt: {scenario.passingScore}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          {scenario.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{scenario.summary}</p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Bối cảnh
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{scenario.context}</p>
            <p className="mt-4 text-sm font-semibold text-slate-900">Mục tiêu</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{scenario.objective}</p>
            <p className="mt-4 text-sm font-semibold text-slate-900">Phù hợp cho</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{scenario.recommendedFor}</p>
          </article>

          <article className="rounded-[1.25rem] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Constraints
            </p>
            <ul className="mt-3 space-y-3">
              {scenario.constraints.map((item) => (
                <li
                  key={item}
                  className="rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {scenario.metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {metric.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{metric.value}</p>
              <p className="mt-2 text-xs leading-6 text-slate-500">{metric.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          {scenario.questions.map((question, index) => {
            const resultRow = result?.answers.find((answer) => answer.questionId === question.id);

            return (
              <article
                key={question.id}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Câu {index + 1}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">{question.prompt}</h2>
                {question.description ? (
                  <p className="mt-3 text-sm leading-7 text-slate-600">{question.description}</p>
                ) : null}

                <div className="mt-5 grid gap-3">
                  {question.options.map((option) => {
                    const isSelected = answers[question.id] === option.id;
                    const isRevealed = Boolean(result);
                    const isCorrectAfterSubmit = isRevealed && option.isCorrect;
                    const isWrongSelected =
                      isRevealed && resultRow?.selectedOptionId === option.id && !option.isCorrect;

                    return (
                      <label
                        key={option.id}
                        className={`rounded-[1.25rem] border px-4 py-4 text-sm transition ${
                          isCorrectAfterSubmit
                            ? "border-emerald-200 bg-emerald-50"
                            : isWrongSelected
                              ? "border-rose-200 bg-rose-50"
                              : isSelected
                                ? "border-slate-400 bg-slate-100"
                                : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name={question.id}
                            checked={isSelected}
                            onChange={() =>
                              setAnswers((current) => ({
                                ...current,
                                [question.id]: option.id,
                              }))
                            }
                            disabled={Boolean(result) || isSubmitting}
                            className="mt-1"
                          />
                          <div>
                            <p className="font-medium text-slate-900">{option.label}</p>
                            {isRevealed ? (
                              <p className="mt-2 leading-6 text-slate-600">{option.explanation}</p>
                            ) : null}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
            <h2 className="text-xl font-semibold text-slate-950">Trạng thái simulator</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">Đã trả lời</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {answeredCount}/{scenario.questions.length}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">Lần làm</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{attempts.length}</p>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">Điểm tốt nhất</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{bestScore}</p>
              </div>
            </div>

            {submitError ? (
              <div className="mt-5 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-7 text-rose-700">
                {submitError}
              </div>
            ) : null}

            {!isAuthenticated ? (
              <div className="mt-5 rounded-[1.25rem] border border-sky-200 bg-sky-50 px-5 py-5 text-sm leading-7 text-sky-900">
                <p className="font-semibold">Đăng nhập để chấm điểm và lưu lịch sử practice.</p>
                <p className="mt-2">
                  Bạn vẫn có thể đọc toàn bộ scenario ngay trên trang này, nhưng hệ thống chỉ lưu
                  attempt khi bạn đăng nhập.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/login" className={getPublicButtonClassName()}>
                    Đăng nhập để bắt đầu
                  </Link>
                  <Link
                    href="/register"
                    className={getPublicButtonClassName({ variant: "secondary" })}
                  >
                    Tạo tài khoản học viên
                  </Link>
                </div>
              </div>
            ) : !result ? (
              <div className="mt-5 space-y-4">
                <p className="text-sm leading-7 text-slate-600">
                  Chọn đáp án cho toàn bộ câu hỏi rồi nộp để xem review. Điểm số và lịch sử attempt
                  của bạn sẽ được lưu trực tiếp vào hệ thống để đồng bộ với dashboard student.
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={answeredCount < scenario.questions.length || isSubmitting}
                  className={`${getPublicButtonClassName()} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {isSubmitting ? "Đang nộp..." : "Nộp simulator"}
                </button>
              </div>
            ) : (
              <div
                className={`mt-5 rounded-[1.25rem] border px-5 py-5 text-sm leading-7 ${
                  result.passed
                    ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                    : "border-amber-200 bg-amber-50 text-amber-950"
                }`}
              >
                <p className="text-lg font-semibold">
                  Kết quả: {result.score}/100 {result.passed ? "(Đạt)" : "(Chưa đạt)"}
                </p>
                <p className="mt-2">
                  {result.passed
                    ? "Bạn đã đi đúng logic chính của scenario này. Có thể chuyển sang case khó hơn hoặc làm lại để tăng độ chắc tay."
                    : "Bạn chưa vượt mốc đạt. Hãy đọc explanation của từng lựa chọn rồi làm lại để củng cố tư duy đọc dữ liệu."}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers({});
                      setResult(null);
                      setSubmitError(null);
                    }}
                    className={getPublicButtonClassName({ variant: "secondary" })}
                  >
                    Làm lại scenario
                  </button>
                  <Link href="/practice" className={getPublicButtonClassName()}>
                    Quay lại practice hub
                  </Link>
                </div>
              </div>
            )}

            {attempts[0] ? (
              <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                Lần làm gần nhất:{" "}
                <span className="font-semibold text-slate-900">{attempts[0].score}/100</span>{" "}
                lúc {new Date(attempts[0].submittedAt).toLocaleString("vi-VN")}
              </div>
            ) : null}
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
            <h3 className="text-xl font-semibold text-slate-950">Lịch sử scenario</h3>
            {attempts.length > 0 ? (
              <div className="mt-5 space-y-3">
                {attempts.map((attempt, index) => (
                  <div
                    key={attempt.id}
                    className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Attempt #{index + 1}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(attempt.submittedAt).toLocaleString("vi-VN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold text-slate-950">{attempt.score}</p>
                        <p
                          className={`text-xs font-semibold ${
                            attempt.passed ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {attempt.passed ? "Đạt" : "Chưa đạt"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm leading-7 text-slate-500">
                Chưa có attempt nào cho scenario này. Làm bài đầu tiên để hệ thống bắt đầu xây
                lịch sử practice của bạn.
              </div>
            )}
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
            <h3 className="text-xl font-semibold text-slate-950">Checklist review</h3>
            <div className="mt-5 space-y-3">
              {scenario.reviewChecklist.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

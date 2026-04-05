"use client";

import type { QuizQuestionType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AdminButton } from "@/components/admin/admin-button";

type QuizChoiceRecord = {
  id: string;
  label: string;
  value: string | null;
  explanation: string | null;
  isCorrect: boolean;
  sortOrder: number;
};

type QuizQuestionRecord = {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  explanation: string | null;
  points: number;
  sortOrder: number;
  choices: QuizChoiceRecord[];
};

type QuizQuestionFormState = {
  id?: string;
  quizId: string;
  type: QuizQuestionType;
  prompt: string;
  explanation: string;
  points: number;
  sortOrder: number;
  choicesText: string;
};

type AdminQuizQuestionsEditorProps = {
  quizId: string;
  questions: QuizQuestionRecord[];
};

const questionTypes: QuizQuestionType[] = [
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "SHORT_TEXT",
];

function mapQuestionToFormState(
  quizId: string,
  question?: QuizQuestionRecord,
): QuizQuestionFormState {
  return {
    id: question?.id,
    quizId,
    type: question?.type ?? "SINGLE_CHOICE",
    prompt: question?.prompt ?? "",
    explanation: question?.explanation ?? "",
    points: question?.points ?? 1,
    sortOrder: question?.sortOrder ?? 0,
    choicesText: question
      ? question.choices
          .map((choice) =>
            [
              choice.label,
              choice.isCorrect ? "true" : "false",
              choice.value ?? "",
              choice.explanation ?? "",
            ].join(" | "),
          )
          .join("\n")
      : "",
  };
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        rows={5}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
      />
      {help ? <span className="text-xs text-slate-500">{help}</span> : null}
    </label>
  );
}

function QuestionFormCard({
  initialState,
  mode,
  canMoveUp = false,
  canMoveDown = false,
}: {
  initialState: QuizQuestionFormState;
  mode: "create" | "edit";
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initialState);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(mode === "create");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/admin/quiz-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(payload.error?.message ?? "Không thể lưu quiz question lúc này.");
        return;
      }

      setSuccessMessage(mode === "create" ? "Đã tạo question." : "Đã cập nhật question.");
      router.refresh();
      if (mode === "edit") {
        setIsOpen(false);
      }
    });
  };

  const handleMove = (direction: "UP" | "DOWN") => {
    if (!values.id) {
      return;
    }

    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/admin/quiz-questions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: values.id,
          direction,
        }),
      });

      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(payload.error?.message ?? "Không thể sắp xếp quiz question lúc này.");
        return;
      }

      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!values.id || !window.confirm("Xóa question này?")) {
      return;
    }

    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/admin/quiz-questions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: values.id,
        }),
      });

      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(payload.error?.message ?? "Không thể xóa quiz question lúc này.");
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            {mode === "create" ? "Tạo quiz question" : `Question ${values.type}`}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {mode === "create"
              ? "Editor trực tiếp cho question và choices."
              : "Bạn có thể sửa prompt, points, type và choices."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "edit" ? (
            <>
              <AdminButton
                size="sm"
                variant="subtle"
                disabled={isPending || !canMoveUp}
                onClick={() => handleMove("UP")}
              >
                Lên
              </AdminButton>
              <AdminButton
                size="sm"
                variant="subtle"
                disabled={isPending || !canMoveDown}
                onClick={() => handleMove("DOWN")}
              >
                Xuống
              </AdminButton>
              <AdminButton size="sm" variant="secondary" onClick={() => setIsOpen((current) => !current)}>
                {isOpen ? "Thu gọn" : "Sửa question"}
              </AdminButton>
              <AdminButton size="sm" variant="dangerSoft" onClick={handleDelete} disabled={isPending}>
                Xóa question
              </AdminButton>
            </>
          ) : null}
        </div>
      </div>

      {isOpen ? (
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 lg:grid-cols-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Loại question</span>
              <select
                value={values.type}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    type: event.target.value as QuizQuestionType,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                {questionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <TextInput
              label="Points"
              type="number"
              value={values.points}
              onChange={(value) => setValues((current) => ({ ...current, points: Number(value) }))}
            />

            <TextInput
              label="Sort order"
              type="number"
              value={values.sortOrder}
              onChange={(value) =>
                setValues((current) => ({ ...current, sortOrder: Number(value) }))
              }
            />
          </div>

          <TextArea
            label="Prompt"
            value={values.prompt}
            onChange={(value) => setValues((current) => ({ ...current, prompt: value }))}
          />

          <TextArea
            label="Explanation"
            value={values.explanation}
            onChange={(value) => setValues((current) => ({ ...current, explanation: value }))}
          />

          <TextArea
            label={values.type === "SHORT_TEXT" ? "Đáp án đúng" : "Choices"}
            value={values.choicesText}
            onChange={(value) => setValues((current) => ({ ...current, choicesText: value }))}
            help={
              values.type === "SHORT_TEXT"
                ? "Mỗi dòng là một đáp án đúng."
                : "Mỗi dòng theo format: label | isCorrect(true/false) | value(optional) | explanation(optional)"
            }
          />

          {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

          <AdminButton variant="primary" onClick={handleSave} disabled={isPending}>
            {isPending ? "Đang lưu..." : mode === "create" ? "Tạo question" : "Lưu question"}
          </AdminButton>
        </div>
      ) : null}
    </div>
  );
}

export function AdminQuizQuestionsEditor({
  quizId,
  questions,
}: AdminQuizQuestionsEditorProps) {
  return (
    <div className="space-y-4">
      <QuestionFormCard initialState={mapQuestionToFormState(quizId)} mode="create" />
      {questions.map((question, index) => (
        <QuestionFormCard
          key={question.id}
          initialState={mapQuestionToFormState(quizId, question)}
          mode="edit"
          canMoveUp={index > 0}
          canMoveDown={index < questions.length - 1}
        />
      ))}
    </div>
  );
}

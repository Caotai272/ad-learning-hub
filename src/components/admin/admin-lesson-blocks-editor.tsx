"use client";

import type { LessonBlockType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AdminButton } from "@/components/admin/admin-button";

type LessonBlockRecord = {
  id: string;
  type: LessonBlockType;
  title: string | null;
  sortOrder: number;
  content: unknown;
};

type LessonBlockFormState = {
  id?: string;
  lessonId: string;
  type: LessonBlockType;
  title: string;
  sortOrder: number;
  body: string;
  tone: "info" | "success" | "warning";
  itemsText: string;
  columnsText: string;
  rowsText: string;
  metricItemsText: string;
  src: string;
  alt: string;
  caption: string;
  poster: string;
};

type AdminLessonBlocksEditorProps = {
  lessonId: string;
  blocks: LessonBlockRecord[];
};

const blockTypes: LessonBlockType[] = [
  "TEXT",
  "CALLOUT",
  "CHECKLIST",
  "TABLE",
  "METRIC_CARD",
  "IMAGE",
  "VIDEO",
  "EMBED",
];

function getObjectContent(content: unknown) {
  return content && typeof content === "object" ? (content as Record<string, unknown>) : {};
}

function mapBlockToFormState(lessonId: string, block?: LessonBlockRecord): LessonBlockFormState {
  const content = getObjectContent(block?.content);

  return {
    id: block?.id,
    lessonId,
    type: block?.type ?? "TEXT",
    title: block?.title ?? "",
    sortOrder: block?.sortOrder ?? 0,
    body: typeof content.body === "string" ? content.body : "",
    tone:
      content.tone === "success" || content.tone === "warning" || content.tone === "info"
        ? content.tone
        : "info",
    itemsText: Array.isArray(content.items)
      ? content.items
          .map((item) => {
            const row = item as { text?: string; checked?: boolean };
            return `${row.checked ? "[x]" : "[ ]"} ${row.text ?? ""}`.trim();
          })
          .join("\n")
      : "",
    columnsText: Array.isArray(content.columns) ? content.columns.join("\n") : "",
    rowsText: Array.isArray(content.rows)
      ? content.rows
          .map((row) => (Array.isArray(row) ? row.join(" | ") : ""))
          .join("\n")
      : "",
    metricItemsText: Array.isArray(content.items)
      ? content.items
          .map((item) => {
            const row = item as {
              label?: string;
              value?: string;
              description?: string;
              trend?: string;
            };
            return [row.label ?? "", row.value ?? "", row.description ?? "", row.trend ?? ""].join(
              " | ",
            );
          })
          .join("\n")
      : "",
    src: typeof content.src === "string" ? content.src : "",
    alt: typeof content.alt === "string" ? content.alt : "",
    caption: typeof content.caption === "string" ? content.caption : "",
    poster: typeof content.poster === "string" ? content.poster : "",
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
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
      />
      {help ? <span className="text-xs text-slate-500">{help}</span> : null}
    </label>
  );
}

function BlockFormCard({
  initialState,
  mode,
  canMoveUp = false,
  canMoveDown = false,
}: {
  initialState: LessonBlockFormState;
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
      const response = await fetch("/api/v1/admin/lesson-blocks", {
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
        setServerError(payload.error?.message ?? "Không thể lưu lesson block lúc này.");
        return;
      }

      setSuccessMessage(mode === "create" ? "Đã tạo block." : "Đã cập nhật block.");
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
      const response = await fetch("/api/v1/admin/lesson-blocks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockId: values.id,
          direction,
        }),
      });

      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(payload.error?.message ?? "Không thể sắp xếp lesson block lúc này.");
        return;
      }

      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!values.id || !window.confirm("Xóa block này?")) {
      return;
    }

    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/admin/lesson-blocks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockId: values.id,
        }),
      });

      const payload = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(payload.error?.message ?? "Không thể xóa lesson block lúc này.");
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
            {mode === "create" ? "Tạo lesson block" : `Block ${values.type}`}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {mode === "create"
              ? "Editor trực tiếp cho content của lesson."
              : "Bạn có thể sửa type, title, sortOrder và nội dung của block."}
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
                {isOpen ? "Thu gọn" : "Sửa block"}
              </AdminButton>
              <AdminButton size="sm" variant="dangerSoft" onClick={handleDelete} disabled={isPending}>
                Xóa block
              </AdminButton>
            </>
          ) : null}
        </div>
      </div>

      {isOpen ? (
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Loại block</span>
              <select
                value={values.type}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    type: event.target.value as LessonBlockType,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                {blockTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <TextInput
              label="Tiêu đề"
              value={values.title}
              onChange={(value) => setValues((current) => ({ ...current, title: value }))}
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

          {(values.type === "TEXT" || values.type === "CALLOUT") && (
            <TextArea
              label="Body"
              value={values.body}
              onChange={(value) => setValues((current) => ({ ...current, body: value }))}
            />
          )}

          {values.type === "CALLOUT" ? (
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Tone</span>
              <select
                value={values.tone}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    tone: event.target.value as "info" | "success" | "warning",
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="info">info</option>
                <option value="success">success</option>
                <option value="warning">warning</option>
              </select>
            </label>
          ) : null}

          {values.type === "CHECKLIST" ? (
            <TextArea
              label="Checklist items"
              value={values.itemsText}
              onChange={(value) => setValues((current) => ({ ...current, itemsText: value }))}
              help="Mỗi dòng một item. Dùng [x] hoặc [ ] ở đầu dòng, ví dụ: [x] Gắn Pixel"
            />
          ) : null}

          {values.type === "TABLE" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <TextArea
                label="Columns"
                value={values.columnsText}
                onChange={(value) => setValues((current) => ({ ...current, columnsText: value }))}
                help="Mỗi dòng là một cột."
              />
              <TextArea
                label="Rows"
                value={values.rowsText}
                onChange={(value) => setValues((current) => ({ ...current, rowsText: value }))}
                help="Mỗi dòng là một row, dùng dấu | để ngăn cột. Ví dụ: CTR | Chỉ số click"
              />
            </div>
          ) : null}

          {values.type === "METRIC_CARD" ? (
            <TextArea
              label="Metric items"
              value={values.metricItemsText}
              onChange={(value) =>
                setValues((current) => ({ ...current, metricItemsText: value }))
              }
              help="Mỗi dòng theo format: label | value | description | trend(up/down/neutral)"
            />
          ) : null}

          {(values.type === "IMAGE" || values.type === "VIDEO" || values.type === "EMBED") && (
            <div className="grid gap-4 lg:grid-cols-2">
              <TextInput
                label="Src"
                value={values.src}
                onChange={(value) => setValues((current) => ({ ...current, src: value }))}
              />

              {values.type === "IMAGE" ? (
                <TextInput
                  label="Alt"
                  value={values.alt}
                  onChange={(value) => setValues((current) => ({ ...current, alt: value }))}
                />
              ) : null}

              {values.type === "VIDEO" ? (
                <TextInput
                  label="Poster"
                  value={values.poster}
                  onChange={(value) => setValues((current) => ({ ...current, poster: value }))}
                />
              ) : null}

              <div className="lg:col-span-2">
                <TextArea
                  label="Caption"
                  value={values.caption}
                  onChange={(value) => setValues((current) => ({ ...current, caption: value }))}
                />
              </div>
            </div>
          )}

          {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

          <AdminButton variant="primary" onClick={handleSave} disabled={isPending}>
            {isPending ? "Đang lưu..." : mode === "create" ? "Tạo block" : "Lưu block"}
          </AdminButton>
        </div>
      ) : null}
    </div>
  );
}

export function AdminLessonBlocksEditor({
  lessonId,
  blocks,
}: AdminLessonBlocksEditorProps) {
  return (
    <div className="space-y-4">
      <BlockFormCard initialState={mapBlockToFormState(lessonId)} mode="create" />
      {blocks.map((block, index) => (
        <BlockFormCard
          key={block.id}
          initialState={mapBlockToFormState(lessonId, block)}
          mode="edit"
          canMoveUp={index > 0}
          canMoveDown={index < blocks.length - 1}
        />
      ))}
    </div>
  );
}

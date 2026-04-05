/* eslint-disable @next/next/no-img-element */
import type { LessonBlockType } from "@prisma/client";
import { z } from "zod";

import { cn } from "@/lib/utils";

type LessonBlockRendererProps = {
  block: {
    type: LessonBlockType;
    title: string | null;
    content: unknown;
  };
};

const textBlockSchema = z.object({
  body: z.string().min(1),
});

const calloutBlockSchema = z.object({
  body: z.string().min(1),
  tone: z.enum(["info", "success", "warning"]).optional(),
});

const checklistBlockSchema = z.object({
  items: z
    .array(
      z.object({
        text: z.string().min(1),
        checked: z.boolean().optional(),
      }),
    )
    .min(1),
});

const tableBlockSchema = z.object({
  columns: z.array(z.string().min(1)).min(1),
  rows: z.array(z.array(z.string())).min(1),
});

const metricCardSchema = z.object({
  items: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
        description: z.string().optional(),
        trend: z.enum(["up", "down", "neutral"]).optional(),
      }),
    )
    .min(1),
});

const imageBlockSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
});

const videoBlockSchema = z.object({
  src: z.string().min(1),
  poster: z.string().optional(),
  caption: z.string().optional(),
});

const embedBlockSchema = z.object({
  src: z.string().min(1),
  title: z.string().optional(),
  caption: z.string().optional(),
});

export function getLessonBlockLabel(type: LessonBlockType) {
  switch (type) {
    case "TEXT":
      return "Nội dung chính";
    case "CALLOUT":
      return "Lưu ý quan trọng";
    case "CHECKLIST":
      return "Checklist triển khai";
    case "TABLE":
      return "Bảng đối chiếu";
    case "METRIC_CARD":
      return "Nhóm metric cần theo dõi";
    case "IMAGE":
      return "Hình minh họa";
    case "VIDEO":
      return "Video tham khảo";
    case "EMBED":
      return "Tài nguyên nhúng";
    default:
      return type;
  }
}

function BlockFallback({ content }: { content: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-[1.25rem] bg-slate-950 p-4 text-sm leading-7 text-slate-100">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}

function splitParagraphs(body: string) {
  return body
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function LessonBlockRenderer({ block }: LessonBlockRendererProps) {
  switch (block.type) {
    case "TEXT": {
      const result = textBlockSchema.safeParse(block.content);

      if (!result.success) {
        return <BlockFallback content={block.content} />;
      }

      return (
        <div className="space-y-4 text-base leading-8 text-slate-700">
          {splitParagraphs(result.data.body).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      );
    }
    case "CALLOUT": {
      const result = calloutBlockSchema.safeParse(block.content);

      if (!result.success) {
        return <BlockFallback content={block.content} />;
      }

      const toneClassName =
        result.data.tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-950"
          : result.data.tone === "warning"
            ? "border-amber-200 bg-amber-50 text-amber-950"
            : "border-sky-200 bg-sky-50 text-sky-950";

      return (
        <div className={cn("rounded-[1.5rem] border p-5", toneClassName)}>
          <p className="text-base leading-8">{result.data.body}</p>
        </div>
      );
    }
    case "CHECKLIST": {
      const result = checklistBlockSchema.safeParse(block.content);

      if (!result.success) {
        return <BlockFallback content={block.content} />;
      }

      return (
        <ul className="space-y-3">
          {result.data.items.map((item) => (
            <li
              key={item.text}
              className="flex items-start gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <span
                className={cn(
                  "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  item.checked
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700",
                )}
              >
                {item.checked ? "✓" : "•"}
              </span>
              <p className="text-sm leading-7 text-slate-700">{item.text}</p>
            </li>
          ))}
        </ul>
      );
    }
    case "TABLE": {
      const result = tableBlockSchema.safeParse(block.content);

      if (!result.success) {
        return <BlockFallback content={block.content} />;
      }

      return (
        <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                {result.data.columns.map((column) => (
                  <th key={column} className="px-4 py-3 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.data.rows.map((row, rowIndex) => (
                <tr key={`${row.join("-")}-${rowIndex}`} className="border-t border-slate-200">
                  {result.data.columns.map((column, columnIndex) => (
                    <td key={`${column}-${rowIndex}`} className="px-4 py-3 align-top text-slate-700">
                      {row[columnIndex] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "METRIC_CARD": {
      const result = metricCardSchema.safeParse(block.content);

      if (!result.success) {
        return <BlockFallback content={block.content} />;
      }

      return (
        <div className="grid gap-4 md:grid-cols-3">
          {result.data.items.map((item) => (
            <article
              key={item.label}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {item.value}
              </p>
              {item.description ? (
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              ) : null}
              {item.trend ? (
                <p
                  className={cn(
                    "mt-4 text-xs font-semibold uppercase tracking-[0.16em]",
                    item.trend === "up"
                      ? "text-emerald-700"
                      : item.trend === "down"
                        ? "text-rose-700"
                        : "text-slate-500",
                  )}
                >
                  {item.trend === "up"
                    ? "Ưu tiên tăng"
                    : item.trend === "down"
                      ? "Cần kéo xuống"
                      : "Theo dõi ổn định"}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      );
    }
    case "IMAGE": {
      const result = imageBlockSchema.safeParse(block.content);

      if (!result.success) {
        return <BlockFallback content={block.content} />;
      }

      return (
        <figure className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
          <img src={result.data.src} alt={result.data.alt} className="h-auto w-full object-cover" />
          {result.data.caption ? (
            <figcaption className="border-t border-slate-200 px-5 py-4 text-sm leading-7 text-slate-600">
              {result.data.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case "VIDEO": {
      const result = videoBlockSchema.safeParse(block.content);

      if (!result.success) {
        return <BlockFallback content={block.content} />;
      }

      return (
        <figure className="space-y-4">
          <video
            controls
            preload="metadata"
            poster={result.data.poster}
            className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-950"
          >
            <source src={result.data.src} />
          </video>
          {result.data.caption ? (
            <figcaption className="text-sm leading-7 text-slate-600">{result.data.caption}</figcaption>
          ) : null}
        </figure>
      );
    }
    case "EMBED": {
      const result = embedBlockSchema.safeParse(block.content);

      if (!result.success) {
        return <BlockFallback content={block.content} />;
      }

      return (
        <figure className="space-y-4">
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
            <iframe
              src={result.data.src}
              title={result.data.title ?? block.title ?? "Tài nguyên nhúng"}
              className="aspect-video w-full bg-slate-100"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {result.data.caption ? (
            <figcaption className="text-sm leading-7 text-slate-600">{result.data.caption}</figcaption>
          ) : null}
        </figure>
      );
    }
    default:
      return <BlockFallback content={block.content} />;
  }
}

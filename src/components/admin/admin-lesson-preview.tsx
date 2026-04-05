import { getLessonBlockLabel, LessonBlockRenderer } from "@/components/learning/lesson-block-renderer";

type AdminLessonPreviewProps = {
  lesson: {
    title: string;
    summary: string | null;
    description: string | null;
    estimatedMinutes: number | null;
    blocks: Array<{
      id: string;
      type: Parameters<typeof getLessonBlockLabel>[0];
      title: string | null;
      content: unknown;
      sortOrder: number;
    }>;
  };
};

export function AdminLessonPreview({ lesson }: AdminLessonPreviewProps) {
  return (
    <details className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
      <summary className="cursor-pointer list-none text-sm font-semibold text-slate-950">
        Preview lesson
      </summary>

      <div className="mt-5 space-y-5">
        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <h4 className="text-lg font-semibold text-slate-950">{lesson.title}</h4>
            {lesson.estimatedMinutes ? (
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                {lesson.estimatedMinutes} phút
              </span>
            ) : null}
          </div>

          {lesson.summary ? (
            <p className="mt-3 text-sm leading-7 text-slate-600">{lesson.summary}</p>
          ) : null}

          {lesson.description ? (
            <p className="mt-3 text-sm leading-7 text-slate-600">{lesson.description}</p>
          ) : null}
        </div>

        {lesson.blocks.length > 0 ? (
          lesson.blocks.map((block) => (
            <article
              key={block.id}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {getLessonBlockLabel(block.type)}
                </span>
                <span className="text-xs text-slate-500">Sort order: {block.sortOrder}</span>
              </div>

              {block.title ? (
                <h5 className="mt-4 text-base font-semibold text-slate-950">{block.title}</h5>
              ) : null}

              <div className="mt-4">
                <LessonBlockRenderer
                  block={{
                    type: block.type,
                    title: block.title,
                    content: block.content,
                  }}
                />
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-sm text-slate-500">
            Lesson này chưa có block nội dung để preview.
          </div>
        )}
      </div>
    </details>
  );
}

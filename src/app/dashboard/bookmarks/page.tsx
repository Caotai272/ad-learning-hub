import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { formatDateTime } from "@/lib/format";
import { listUserBookmarks } from "@/modules/bookmarks/bookmark.service";

export default async function DashboardBookmarksPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const bookmarks = await listUserBookmarks(session.user.id);
  const totalBookmarkCount = bookmarks.lessons.length + bookmarks.glossaryTerms.length;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Bookmarks của tôi</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Lưu lại lesson và glossary term quan trọng để quay lại nhanh trong lúc học, ôn quiz hoặc
          thực hành simulator.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Tổng bookmark",
              value: totalBookmarkCount.toString(),
            },
            {
              label: "Lesson đã lưu",
              value: bookmarks.lessons.length.toString(),
            },
            {
              label: "Thuật ngữ đã lưu",
              value: bookmarks.glossaryTerms.length.toString(),
            },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      {totalBookmarkCount === 0 ? (
        <DashboardEmptyState
          eyebrow="Bookmarks trống"
          title="Bạn chưa lưu nội dung nào"
          description="Hãy lưu lesson hoặc glossary term trong lúc học để tạo thư viện ôn tập riêng của bạn."
          actionHref="/courses"
          actionLabel="Xem khóa học"
          hint="Bạn cũng có thể vào glossary để lưu các thuật ngữ ads cần tra cứu thường xuyên."
        />
      ) : null}

      {bookmarks.lessons.length > 0 ? (
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-950">Lesson đã lưu</h3>
          <div className="mt-5 grid gap-4">
            {bookmarks.lessons.map((bookmark) => (
              <article
                key={bookmark.id}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-sm text-slate-500">{bookmark.lesson.course.title}</p>
                <h4 className="mt-2 text-lg font-semibold text-slate-950">{bookmark.lesson.title}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {bookmark.lesson.summary ?? "Lesson đã được lưu để mở lại nhanh."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span>Đã lưu: {formatDateTime(bookmark.createdAt)}</span>
                </div>
                <Link
                  href={`/courses/${bookmark.lesson.course.slug}/lessons/${bookmark.lesson.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-4"
                >
                  Mở lại lesson
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {bookmarks.glossaryTerms.length > 0 ? (
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-semibold text-slate-950">Thuật ngữ đã lưu</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {bookmarks.glossaryTerms.map((bookmark) => (
              <article
                key={bookmark.id}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-5"
              >
                <h4 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {bookmark.glossaryTerm.term}
                </h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {bookmark.glossaryTerm.shortDefinition}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span>Đã lưu: {formatDateTime(bookmark.createdAt)}</span>
                </div>
                <Link
                  href={`/glossary/${bookmark.glossaryTerm.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-slate-900 underline underline-offset-4"
                >
                  Mở lại thuật ngữ
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { BookmarkToggleButton } from "@/components/common/bookmark-toggle-button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicButtonClassName } from "@/components/ui/public-button";
import { getBookmarkState } from "@/modules/bookmarks/bookmark.service";
import { getPublishedGlossaryTermBySlug } from "@/modules/glossary/glossary.service";

type GlossaryDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: GlossaryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = await getPublishedGlossaryTermBySlug(slug);

  return {
    title: term.term,
    description: term.shortDefinition,
  };
}

export default async function GlossaryDetailPage({ params }: GlossaryDetailPageProps) {
  const { slug } = await params;
  const [session, term] = await Promise.all([auth(), getPublishedGlossaryTermBySlug(slug)]);
  const bookmarkState = session?.user?.id
    ? await getBookmarkState(session.user.id, {
        glossaryTermId: term.id,
      })
    : { isBookmarked: false };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Glossary / {term.term}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {term.term}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            {term.shortDefinition}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {term.aliases.map((alias) => (
              <span
                key={alias}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600"
              >
                {alias}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
            <h2 className="text-2xl font-semibold text-slate-950">Giải thích chi tiết</h2>
            <div className="mt-4 space-y-4 text-sm leading-8 text-slate-700">
              {term.description.split(/\n+/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
              <h2 className="text-xl font-semibold text-slate-950">Lưu để học lại</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Bookmark thuật ngữ này để sau đó mở lại nhanh từ dashboard bookmarks.
              </p>

              {session?.user?.id ? (
                <div className="mt-5">
                  <BookmarkToggleButton
                    targetType="GLOSSARY_TERM"
                    targetId={term.id}
                    initialBookmarked={bookmarkState.isBookmarked}
                    activeLabel="Đã lưu thuật ngữ"
                    idleLabel="Lưu thuật ngữ"
                  />
                </div>
              ) : (
                <Link href="/login" className={`mt-5 ${getPublicButtonClassName()}`}>
                  Đăng nhập để lưu bookmark
                </Link>
              )}
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]">
              <h2 className="text-xl font-semibold text-slate-950">Lesson liên quan</h2>
              <div className="mt-5 grid gap-3">
                {term.relatedLessons.length > 0 ? (
                  term.relatedLessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${lesson.course.slug}/lessons/${lesson.slug}`}
                      className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm transition hover:border-slate-300"
                    >
                      <p className="font-semibold text-slate-950">{lesson.title}</p>
                      <p className="mt-2 text-slate-500">{lesson.course.title}</p>
                      <p className="mt-2 leading-6 text-slate-600">
                        {lesson.summary ?? "Lesson có nhắc tới thuật ngữ này."}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-slate-600">
                    Thuật ngữ này hiện chưa được gắn với lesson publish nào.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

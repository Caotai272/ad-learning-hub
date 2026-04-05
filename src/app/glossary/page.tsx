import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicButtonClassName } from "@/components/ui/public-button";
import { getPlatformLabel } from "@/lib/learning";
import { listPublishedGlossaryTerms } from "@/modules/glossary/glossary.service";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Thư viện thuật ngữ ads bằng tiếng Việt, giữ nguyên các thuật ngữ chuyên ngành như CTR, CPM, ROAS, Pixel, Lookalike, Conversion.",
};

export default async function GlossaryPage() {
  const terms = await listPublishedGlossaryTerms();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-800">
            Glossary
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Thư viện thuật ngữ ads
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Khu này giúp học viên tra cứu nhanh các thuật ngữ ads quan trọng trong suốt quá trình
            học lesson, làm quiz và thực hành simulator. Các thuật ngữ chuyên ngành vẫn giữ nguyên
            tiếng Anh, phần giải thích được viết bằng tiếng Việt.
          </p>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {terms.map((term) => (
            <article
              key={term.id}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(17,33,53,0.06)]"
            >
              <div className="flex flex-wrap gap-2">
                {term.platform ? (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {getPlatformLabel(term.platform)}
                  </span>
                ) : (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    Cross-platform
                  </span>
                )}
                {term.aliases.length > 0 ? (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {term.aliases.length} alias
                  </span>
                ) : null}
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                {term.term}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{term.shortDefinition}</p>

              {term.relatedLessons.length > 0 ? (
                <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                    Xuất hiện trong lesson
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {term.relatedLessons[0].title}
                    {term.relatedLessons.length > 1
                      ? ` và ${term.relatedLessons.length - 1} lesson khác`
                      : ""}
                  </p>
                </div>
              ) : null}

              <Link
                href={`/glossary/${term.slug}`}
                className={`mt-6 ${getPublicButtonClassName()}`}
              >
                Xem chi tiết thuật ngữ
              </Link>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Giới thiệu Ads Learning Hub
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Ads Learning Hub được xây cho người Việt muốn học bài bản về ads, nhưng vẫn
            giữ đúng ngôn ngữ vận hành thực tế của ngành như Campaign, Ad Set,
            Creative, CTR, CPM, ROAS hay Conversion.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

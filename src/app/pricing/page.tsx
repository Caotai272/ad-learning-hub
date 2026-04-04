import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-shell py-12">
        <section className="glass-panel rounded-[2rem] px-8 py-12">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Bảng giá
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Giai đoạn 1 mới dựng nền kỹ thuật. Bảng giá hiện là placeholder để khóa
            route và bố cục marketing ban đầu.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

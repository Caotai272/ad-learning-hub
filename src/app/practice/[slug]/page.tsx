import { auth } from "@/auth";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PracticeSimulator } from "@/components/practice/practice-simulator";
import {
  getPracticeScenarioBySlug,
  listPracticeAttemptsByUser,
} from "@/modules/practice/practice.service";

type PracticeScenarioPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PracticeScenarioPage({
  params,
}: PracticeScenarioPageProps) {
  const { slug } = await params;
  const session = await auth();
  const scenario = getPracticeScenarioBySlug(slug);
  const initialAttempts = session?.user?.id
    ? await listPracticeAttemptsByUser(session.user.id, {
        scenarioSlug: slug,
        limit: 5,
      })
    : [];

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container-shell py-12">
        <PracticeSimulator
          scenario={scenario}
          initialAttempts={initialAttempts}
          isAuthenticated={Boolean(session?.user?.id)}
        />
      </main>

      <SiteFooter />
    </div>
  );
}

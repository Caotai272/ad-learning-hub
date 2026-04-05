import { notFound } from "next/navigation";

import {
  findPublishedGlossaryTermBySlug,
  listPublishedGlossaryRoutes,
  listPublishedGlossaryTermsByLessonId,
  listPublishedGlossaryTermsFromDb,
} from "@/modules/glossary/glossary.repository";

function parseAliases(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function mapGlossaryTerm<T extends { aliases: unknown }>(term: T) {
  return {
    ...term,
    aliases: parseAliases(term.aliases),
  };
}

export async function listPublishedGlossaryTerms(searchQuery?: string) {
  const terms = await listPublishedGlossaryTermsFromDb(searchQuery?.trim());

  return terms.map((term) =>
    mapGlossaryTerm({
      ...term,
      relatedLessons: term.relatedLessons.map((item) => item.lesson),
    }),
  );
}

export async function getPublishedGlossaryTermBySlug(slug: string) {
  const term = await findPublishedGlossaryTermBySlug(slug);

  if (!term) {
    notFound();
  }

  return mapGlossaryTerm({
    ...term,
    relatedLessons: term.relatedLessons.map((item) => item.lesson),
  });
}

export async function listPublishedGlossaryTermsForLesson(lessonId: string) {
  const terms = await listPublishedGlossaryTermsByLessonId(lessonId);

  return terms.map((item) => mapGlossaryTerm(item.glossaryTerm));
}

export async function listPublishedGlossarySitemapEntries() {
  return listPublishedGlossaryRoutes();
}

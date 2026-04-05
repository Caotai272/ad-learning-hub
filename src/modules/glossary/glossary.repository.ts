import { prisma } from "@/server/db";

export function listPublishedGlossaryTermsFromDb(searchQuery?: string) {
  return prisma.glossaryTerm.findMany({
    where: {
      status: "PUBLISHED",
      ...(searchQuery
        ? {
            OR: [
              {
                term: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                shortDefinition: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
    include: {
      relatedLessons: {
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          lesson: {
            select: {
              id: true,
              slug: true,
              title: true,
              course: {
                select: {
                  slug: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { term: "asc" }],
  });
}

export function findPublishedGlossaryTermBySlug(slug: string) {
  return prisma.glossaryTerm.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      relatedLessons: {
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          lesson: {
            select: {
              id: true,
              slug: true,
              title: true,
              summary: true,
              course: {
                select: {
                  slug: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export function listPublishedGlossaryTermsByLessonId(lessonId: string) {
  return prisma.lessonGlossaryTerm.findMany({
    where: {
      lessonId,
      glossaryTerm: {
        status: "PUBLISHED",
      },
    },
    include: {
      glossaryTerm: true,
    },
    orderBy: [{ sortOrder: "asc" }, { glossaryTerm: { term: "asc" } }],
  });
}

export function listPublishedGlossaryRoutes() {
  return prisma.glossaryTerm.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: [{ sortOrder: "asc" }, { term: "asc" }],
  });
}

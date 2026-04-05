import type { BookmarkToggleInput } from "@/modules/bookmarks/bookmark.schema";
import { prisma } from "@/server/db";

type BookmarkStateInput = {
  lessonId?: string | null;
  glossaryTermId?: string | null;
};

export async function getBookmarkState(userId: string, input: BookmarkStateInput) {
  const bookmark = await prisma.bookmark.findFirst({
    where: {
      userId,
      ...(input.lessonId ? { lessonId: input.lessonId } : {}),
      ...(input.glossaryTermId ? { glossaryTermId: input.glossaryTermId } : {}),
    },
    select: {
      id: true,
    },
  });

  return {
    isBookmarked: Boolean(bookmark),
  };
}

export async function toggleBookmark(userId: string, input: BookmarkToggleInput) {
  if (input.targetType === "LESSON") {
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: input.targetId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        course: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new Error("Lesson không tồn tại.");
    }

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lesson.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      });

      return {
        targetType: "LESSON" as const,
        targetId: lesson.id,
        bookmarked: false,
        title: lesson.title,
        href: `/courses/${lesson.course.slug}/lessons/${lesson.slug}`,
      };
    }

    await prisma.bookmark.create({
      data: {
        userId,
        lessonId: lesson.id,
      },
    });

    return {
      targetType: "LESSON" as const,
      targetId: lesson.id,
      bookmarked: true,
      title: lesson.title,
      href: `/courses/${lesson.course.slug}/lessons/${lesson.slug}`,
    };
  }

  const term = await prisma.glossaryTerm.findUnique({
    where: {
      id: input.targetId,
    },
    select: {
      id: true,
      term: true,
      slug: true,
    },
  });

  if (!term) {
    throw new Error("Glossary term không tồn tại.");
  }

  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_glossaryTermId: {
        userId,
        glossaryTermId: term.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({
      where: {
        id: existingBookmark.id,
      },
    });

    return {
      targetType: "GLOSSARY_TERM" as const,
      targetId: term.id,
      bookmarked: false,
      title: term.term,
      href: `/glossary/${term.slug}`,
    };
  }

  await prisma.bookmark.create({
    data: {
      userId,
      glossaryTermId: term.id,
    },
  });

  return {
    targetType: "GLOSSARY_TERM" as const,
    targetId: term.id,
    bookmarked: true,
    title: term.term,
    href: `/glossary/${term.slug}`,
  };
}

export async function listUserBookmarks(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId,
    },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          course: {
            select: {
              slug: true,
              title: true,
            },
          },
        },
      },
      glossaryTerm: {
        select: {
          id: true,
          term: true,
          slug: true,
          shortDefinition: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    lessons: bookmarks
      .filter((bookmark) => bookmark.lesson !== null)
      .map((bookmark) => ({
        id: bookmark.id,
        createdAt: bookmark.createdAt.toISOString(),
        lesson: {
          id: bookmark.lesson!.id,
          title: bookmark.lesson!.title,
          slug: bookmark.lesson!.slug,
          summary: bookmark.lesson!.summary,
          course: {
            slug: bookmark.lesson!.course.slug,
            title: bookmark.lesson!.course.title,
          },
        },
      })),
    glossaryTerms: bookmarks
      .filter((bookmark) => bookmark.glossaryTerm !== null)
      .map((bookmark) => ({
        id: bookmark.id,
        createdAt: bookmark.createdAt.toISOString(),
        glossaryTerm: {
          id: bookmark.glossaryTerm!.id,
          term: bookmark.glossaryTerm!.term,
          slug: bookmark.glossaryTerm!.slug,
          shortDefinition: bookmark.glossaryTerm!.shortDefinition,
        },
      })),
  };
}

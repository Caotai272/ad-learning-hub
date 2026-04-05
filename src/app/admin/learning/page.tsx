import { AdminContentStatusControl } from "@/components/admin/admin-content-status-control";
import { AdminLearningEntityForm } from "@/components/admin/admin-learning-entity-form";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { formatDateTime } from "@/lib/format";
import { getLevelLabel, getPlatformLabel } from "@/lib/learning";
import { getAdminLearningInventory } from "@/modules/admin/admin.service";

export default async function AdminLearningPage() {
  const inventory = await getAdminLearningInventory();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Learning path", value: inventory.learningPaths.length },
          { label: "Course", value: inventory.courses.length },
          { label: "Module", value: inventory.modules.length },
          { label: "Lesson", value: inventory.lessons.length },
          { label: "Quiz", value: inventory.quizzes.length },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">CMS cho learning schema</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Khu này đã mở form create/edit trực tiếp cho learning path, course, module, lesson và
          quiz. Bạn có thể chỉnh metadata, quan hệ chính và trạng thái publish ngay trong admin.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AdminLearningEntityForm
          entityType="LEARNING_PATH"
          title="Tạo learning path"
          mode="create"
          options={inventory.formOptions}
          defaultValues={{
            title: "",
            slug: "",
            summary: "",
            description: "",
            platform: "FACEBOOK_ADS",
            level: "BEGINNER",
            sortOrder: inventory.learningPaths.length,
            estimatedHours: "",
            courseIds: [],
          }}
        />

        <AdminLearningEntityForm
          entityType="COURSE"
          title="Tạo course"
          mode="create"
          options={inventory.formOptions}
          defaultValues={{
            title: "",
            slug: "",
            summary: "",
            description: "",
            platform: "FACEBOOK_ADS",
            level: "BEGINNER",
            sortOrder: inventory.courses.length,
            estimatedHours: "",
            thumbnailUrl: "",
            learningPathIds: [],
          }}
        />

        <AdminLearningEntityForm
          entityType="MODULE"
          title="Tạo module"
          mode="create"
          options={inventory.formOptions}
          defaultValues={{
            title: "",
            slug: "",
            courseId: inventory.formOptions.courses[0]?.id ?? "",
            summary: "",
            description: "",
            sortOrder: inventory.modules.length,
          }}
        />

        <AdminLearningEntityForm
          entityType="LESSON"
          title="Tạo lesson"
          mode="create"
          options={inventory.formOptions}
          defaultValues={{
            title: "",
            slug: "",
            courseId: inventory.formOptions.courses[0]?.id ?? "",
            courseModuleId: inventory.formOptions.modules[0]?.id ?? "",
            summary: "",
            description: "",
            sortOrder: inventory.lessons.length,
            estimatedMinutes: "",
          }}
        />

        <AdminLearningEntityForm
          entityType="QUIZ"
          title="Tạo quiz"
          mode="create"
          options={inventory.formOptions}
          defaultValues={{
            title: "",
            slug: "",
            courseId: inventory.formOptions.courses[0]?.id ?? "",
            courseModuleId: "",
            lessonId: "",
            description: "",
            passingScore: 70,
            timeLimitMinutes: "",
            maxAttempts: "",
            sortOrder: inventory.quizzes.length,
          }}
        />
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Learning paths</h2>
        <div className="mt-5 grid gap-4">
          {inventory.learningPaths.map((path) => (
            <article
              key={path.id}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-slate-950">{path.title}</h3>
                    <AdminStatusBadge status={path.status} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{path.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {getPlatformLabel(path.platform)}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {getLevelLabel(path.level)}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {path.courses.length} course
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    Cập nhật: {formatDateTime(path.updatedAt)}
                  </p>
                </div>

                <div className="w-full max-w-xl space-y-4">
                  <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Course bên trong
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {path.courses.length > 0 ? (
                        path.courses.map((relation) => (
                          <span
                            key={relation.courseId}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
                          >
                            {relation.course.title}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">Chưa gắn course.</span>
                      )}
                    </div>
                    <div className="mt-4">
                      <AdminContentStatusControl
                        entityType="LEARNING_PATH"
                        entityId={path.id}
                        currentStatus={path.status}
                      />
                    </div>
                  </div>

                  <AdminLearningEntityForm
                    entityType="LEARNING_PATH"
                    title={`Sửa learning path: ${path.title}`}
                    mode="edit"
                    options={inventory.formOptions}
                    defaultValues={{
                      id: path.id,
                      title: path.title,
                      slug: path.slug,
                      summary: path.summary,
                      description: path.description ?? "",
                      platform: path.platform,
                      level: path.level,
                      sortOrder: path.sortOrder,
                      estimatedHours: path.estimatedHours?.toString() ?? "",
                      courseIds: path.courses.map((item) => item.courseId),
                    }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Courses</h2>
        <div className="mt-5 grid gap-4">
          {inventory.courses.map((course) => (
            <article
              key={course.id}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-slate-950">{course.title}</h3>
                    <AdminStatusBadge status={course.status} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{course.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {getPlatformLabel(course.platform)}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {getLevelLabel(course.level)}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {course._count.modules} module
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {course._count.lessons} lesson
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {course._count.quizzes} quiz
                    </span>
                  </div>
                </div>

                <div className="w-full max-w-xl space-y-4">
                  <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                    <div className="grid gap-2 text-sm text-slate-600">
                      <p>Enrollment: {course._count.enrollments}</p>
                      <p>
                        Learning paths:
                        {" "}
                        {course.learningPaths.map((item) => item.learningPath.title).join(", ") || "Chưa gắn"}
                      </p>
                      <p>Cập nhật: {formatDateTime(course.updatedAt)}</p>
                    </div>
                    <div className="mt-4">
                      <AdminContentStatusControl
                        entityType="COURSE"
                        entityId={course.id}
                        currentStatus={course.status}
                      />
                    </div>
                  </div>

                  <AdminLearningEntityForm
                    entityType="COURSE"
                    title={`Sửa course: ${course.title}`}
                    mode="edit"
                    options={inventory.formOptions}
                    defaultValues={{
                      id: course.id,
                      title: course.title,
                      slug: course.slug,
                      summary: course.summary,
                      description: course.description ?? "",
                      platform: course.platform,
                      level: course.level,
                      sortOrder: course.sortOrder,
                      estimatedHours: course.estimatedHours?.toString() ?? "",
                      thumbnailUrl: course.thumbnailUrl ?? "",
                      learningPathIds: course.learningPaths.map((item) => item.learningPathId),
                    }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Modules</h2>
          <div className="mt-5 grid gap-4">
            {inventory.modules.map((module) => (
              <div
                key={module.id}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{module.title}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{module.course.title}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        {module._count.lessons} lesson · {module._count.quizzes} quiz
                      </p>
                    </div>
                    <AdminStatusBadge status={module.status} />
                  </div>
                  <AdminContentStatusControl
                    entityType="MODULE"
                    entityId={module.id}
                    currentStatus={module.status}
                  />
                  <AdminLearningEntityForm
                    entityType="MODULE"
                    title={`Sửa module: ${module.title}`}
                    mode="edit"
                    options={inventory.formOptions}
                    defaultValues={{
                      id: module.id,
                      title: module.title,
                      slug: module.slug,
                      courseId: module.courseId,
                      summary: module.summary ?? "",
                      description: module.description ?? "",
                      sortOrder: module.sortOrder,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-950">Lessons</h2>
          <div className="mt-5 grid gap-4">
            {inventory.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{lesson.title}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {lesson.course.title} / {lesson.courseModule.title}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {lesson._count.blocks} block · {lesson._count.quizzes} quiz · {lesson._count.progressEntries} progress
                      </p>
                    </div>
                    <AdminStatusBadge status={lesson.status} />
                  </div>
                  <AdminContentStatusControl
                    entityType="LESSON"
                    entityId={lesson.id}
                    currentStatus={lesson.status}
                  />
                  <AdminLearningEntityForm
                    entityType="LESSON"
                    title={`Sửa lesson: ${lesson.title}`}
                    mode="edit"
                    options={inventory.formOptions}
                    defaultValues={{
                      id: lesson.id,
                      title: lesson.title,
                      slug: lesson.slug,
                      courseId: lesson.courseId,
                      courseModuleId: lesson.courseModuleId,
                      summary: lesson.summary ?? "",
                      description: lesson.description ?? "",
                      sortOrder: lesson.sortOrder,
                      estimatedMinutes: lesson.estimatedMinutes?.toString() ?? "",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-950">Quizzes</h2>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {inventory.quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{quiz.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {quiz.course.title}
                      {quiz.lesson ? ` / ${quiz.lesson.title}` : ""}
                      {!quiz.lesson && quiz.courseModule ? ` / ${quiz.courseModule.title}` : ""}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {quiz._count.questions} câu hỏi · {quiz._count.attempts} attempt
                    </p>
                  </div>
                  <AdminStatusBadge status={quiz.status} />
                </div>
                <AdminContentStatusControl
                  entityType="QUIZ"
                  entityId={quiz.id}
                  currentStatus={quiz.status}
                />
                <AdminLearningEntityForm
                  entityType="QUIZ"
                  title={`Sửa quiz: ${quiz.title}`}
                  mode="edit"
                  options={inventory.formOptions}
                  defaultValues={{
                    id: quiz.id,
                    title: quiz.title,
                    slug: quiz.slug,
                    courseId: quiz.courseId,
                    courseModuleId: quiz.courseModuleId ?? "",
                    lessonId: quiz.lessonId ?? "",
                    description: quiz.description ?? "",
                    passingScore: quiz.passingScore,
                    timeLimitMinutes: quiz.timeLimitMinutes?.toString() ?? "",
                    maxAttempts: quiz.maxAttempts?.toString() ?? "",
                    sortOrder: quiz.sortOrder,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

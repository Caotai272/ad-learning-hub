"use client";

import { DifficultyLevel, Platform } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import type { AdminEntityType } from "@/modules/admin/admin.service";

type FormOptions = {
  learningPaths: Array<{
    id: string;
    title: string;
  }>;
  courses: Array<{
    id: string;
    title: string;
    platform: Platform;
    level: DifficultyLevel;
  }>;
  modules: Array<{
    id: string;
    title: string;
    courseId: string;
  }>;
  lessons: Array<{
    id: string;
    title: string;
    courseId: string;
    courseModuleId: string;
  }>;
};

type LearningPathValues = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  platform: Platform;
  level: DifficultyLevel;
  sortOrder: number;
  estimatedHours: string;
  courseIds: string[];
};

type CourseValues = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  platform: Platform;
  level: DifficultyLevel;
  sortOrder: number;
  estimatedHours: string;
  thumbnailUrl: string;
  learningPathIds: string[];
};

type ModuleValues = {
  id?: string;
  title: string;
  slug: string;
  courseId: string;
  summary: string;
  description: string;
  sortOrder: number;
};

type LessonValues = {
  id?: string;
  title: string;
  slug: string;
  courseId: string;
  courseModuleId: string;
  summary: string;
  description: string;
  sortOrder: number;
  estimatedMinutes: string;
};

type QuizValues = {
  id?: string;
  title: string;
  slug: string;
  courseId: string;
  courseModuleId: string;
  lessonId: string;
  description: string;
  passingScore: number;
  timeLimitMinutes: string;
  maxAttempts: string;
  sortOrder: number;
};

type EntityValues =
  | LearningPathValues
  | CourseValues
  | ModuleValues
  | LessonValues
  | QuizValues;

type AdminLearningEntityFormProps = {
  entityType: AdminEntityType;
  title: string;
  mode: "create" | "edit";
  options: FormOptions;
  defaultValues: EntityValues;
};

const platformOptions = Object.values(Platform);
const levelOptions = Object.values(DifficultyLevel);

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
      />
    </label>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxGroup({
  label,
  values,
  onToggle,
  options,
}: {
  label: string;
  values: string[];
  onToggle: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="grid gap-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="grid gap-2 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-3">
        {options.length > 0 ? (
          options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={values.includes(option.value)}
                onChange={() => onToggle(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))
        ) : (
          <p className="text-sm text-slate-500">Chưa có lựa chọn nào khả dụng.</p>
        )}
      </div>
    </div>
  );
}

function toNullableNumber(value: string) {
  if (!value.trim()) {
    return NaN;
  }

  return Number(value);
}

export function AdminLearningEntityForm({
  entityType,
  title,
  mode,
  options,
  defaultValues,
}: AdminLearningEntityFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(mode === "create");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<EntityValues>(defaultValues);

  const moduleOptions = useMemo(() => {
    if (entityType === "LESSON") {
      const lessonValues = values as LessonValues;
      return options.modules.filter((item) => item.courseId === lessonValues.courseId);
    }

    if (entityType === "QUIZ") {
      const quizValues = values as QuizValues;
      return options.modules.filter((item) => item.courseId === quizValues.courseId);
    }

    return options.modules;
  }, [entityType, options.modules, values]);

  const lessonOptions = useMemo(() => {
    if (entityType !== "QUIZ") {
      return options.lessons;
    }

    const quizValues = values as QuizValues;
    return options.lessons.filter((item) => item.courseId === quizValues.courseId);
  }, [entityType, options.lessons, values]);

  const toggleLearningPathCourseId = (targetId: string) => {
    setValues((current) => {
      const next = { ...(current as LearningPathValues) };
      const currentValues = next.courseIds;

      next.courseIds = currentValues.includes(targetId)
        ? currentValues.filter((value) => value !== targetId)
        : [...currentValues, targetId];

      return next;
    });
  };

  const toggleCourseLearningPathId = (targetId: string) => {
    setValues((current) => {
      const next = { ...(current as CourseValues) };
      const currentValues = next.learningPathIds;

      next.learningPathIds = currentValues.includes(targetId)
        ? currentValues.filter((value) => value !== targetId)
        : [...currentValues, targetId];

      return next;
    });
  };

  const handleSubmit = () => {
    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const payload =
        entityType === "LEARNING_PATH"
          ? {
              entityType,
              values: {
                ...(values as LearningPathValues),
                estimatedHours: toNullableNumber((values as LearningPathValues).estimatedHours),
              },
            }
          : entityType === "COURSE"
            ? {
                entityType,
                values: {
                  ...(values as CourseValues),
                  estimatedHours: toNullableNumber((values as CourseValues).estimatedHours),
                },
              }
            : entityType === "MODULE"
              ? {
                  entityType,
                  values,
                }
              : entityType === "LESSON"
                ? {
                    entityType,
                    values: {
                      ...(values as LessonValues),
                      estimatedMinutes: toNullableNumber((values as LessonValues).estimatedMinutes),
                    },
                  }
                : {
                    entityType,
                    values: {
                      ...(values as QuizValues),
                      courseModuleId: (values as QuizValues).courseModuleId || undefined,
                      lessonId: (values as QuizValues).lessonId || undefined,
                      timeLimitMinutes: toNullableNumber((values as QuizValues).timeLimitMinutes),
                      maxAttempts: toNullableNumber((values as QuizValues).maxAttempts),
                    },
                  };

      const response = await fetch("/api/v1/admin/learning-entities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        setServerError(result.error?.message ?? "Không thể lưu nội dung lúc này.");
        return;
      }

      setSuccessMessage(mode === "create" ? "Đã tạo item mới." : "Đã cập nhật item.");
      if (mode === "create") {
        setValues(defaultValues);
      }
      router.refresh();
      if (mode === "edit") {
        setIsOpen(false);
      }
    });
  };

  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SectionTitle
          title={title}
          subtitle={mode === "create" ? "Form tạo mới trực tiếp trong CMS" : "Form chỉnh sửa trực tiếp trong CMS"}
        />
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
        >
          {isOpen ? "Thu gọn" : mode === "create" ? "Mở form tạo" : "Sửa item"}
        </button>
      </div>

      {isOpen ? (
        <div className="mt-5 space-y-5">
          {(entityType === "LEARNING_PATH" || entityType === "COURSE") && (
            <div className="grid gap-4 lg:grid-cols-2">
              <TextInput
                label="Tiêu đề"
                value={(values as LearningPathValues | CourseValues).title}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as LearningPathValues | CourseValues), title: value }))
                }
              />
              <TextInput
                label="Slug"
                value={(values as LearningPathValues | CourseValues).slug}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as LearningPathValues | CourseValues), slug: value }))
                }
              />
              <SelectInput
                label="Platform"
                value={(values as LearningPathValues | CourseValues).platform}
                onChange={(value) =>
                  setValues((current) => ({
                    ...(current as LearningPathValues | CourseValues),
                    platform: value as Platform,
                  }))
                }
                options={platformOptions.map((option) => ({ value: option, label: option }))}
              />
              <SelectInput
                label="Level"
                value={(values as LearningPathValues | CourseValues).level}
                onChange={(value) =>
                  setValues((current) => ({
                    ...(current as LearningPathValues | CourseValues),
                    level: value as DifficultyLevel,
                  }))
                }
                options={levelOptions.map((option) => ({ value: option, label: option }))}
              />
              <TextInput
                label="Sort order"
                type="number"
                value={(values as LearningPathValues | CourseValues).sortOrder}
                onChange={(value) =>
                  setValues((current) => ({
                    ...(current as LearningPathValues | CourseValues),
                    sortOrder: Number(value),
                  }))
                }
              />
              <TextInput
                label="Ước lượng"
                type="number"
                value={(values as LearningPathValues | CourseValues).estimatedHours}
                onChange={(value) =>
                  setValues((current) => ({
                    ...(current as LearningPathValues | CourseValues),
                    estimatedHours: value,
                  }))
                }
                placeholder="Đơn vị: giờ"
              />
              <div className="lg:col-span-2">
                <TextAreaInput
                  label="Summary"
                  value={(values as LearningPathValues | CourseValues).summary}
                  onChange={(value) =>
                    setValues((current) => ({ ...(current as LearningPathValues | CourseValues), summary: value }))
                  }
                />
              </div>
              <div className="lg:col-span-2">
                <TextAreaInput
                  label="Description"
                  value={(values as LearningPathValues | CourseValues).description}
                  onChange={(value) =>
                    setValues((current) => ({
                      ...(current as LearningPathValues | CourseValues),
                      description: value,
                    }))
                  }
                />
              </div>
              {entityType === "COURSE" ? (
                <div className="lg:col-span-2">
                  <TextInput
                    label="Thumbnail URL"
                    value={(values as CourseValues).thumbnailUrl}
                    onChange={(value) =>
                      setValues((current) => ({ ...(current as CourseValues), thumbnailUrl: value }))
                    }
                  />
                </div>
              ) : null}
            </div>
          )}

          {entityType === "MODULE" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <TextInput
                label="Tiêu đề"
                value={(values as ModuleValues).title}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as ModuleValues), title: value }))
                }
              />
              <TextInput
                label="Slug"
                value={(values as ModuleValues).slug}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as ModuleValues), slug: value }))
                }
              />
              <SelectInput
                label="Course"
                value={(values as ModuleValues).courseId}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as ModuleValues), courseId: value }))
                }
                options={options.courses.map((item) => ({ value: item.id, label: item.title }))}
              />
              <TextInput
                label="Sort order"
                type="number"
                value={(values as ModuleValues).sortOrder}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as ModuleValues), sortOrder: Number(value) }))
                }
              />
              <div className="lg:col-span-2">
                <TextAreaInput
                  label="Summary"
                  value={(values as ModuleValues).summary}
                  onChange={(value) =>
                    setValues((current) => ({ ...(current as ModuleValues), summary: value }))
                  }
                />
              </div>
              <div className="lg:col-span-2">
                <TextAreaInput
                  label="Description"
                  value={(values as ModuleValues).description}
                  onChange={(value) =>
                    setValues((current) => ({ ...(current as ModuleValues), description: value }))
                  }
                />
              </div>
            </div>
          )}

          {entityType === "LESSON" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <TextInput
                label="Tiêu đề"
                value={(values as LessonValues).title}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as LessonValues), title: value }))
                }
              />
              <TextInput
                label="Slug"
                value={(values as LessonValues).slug}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as LessonValues), slug: value }))
                }
              />
              <SelectInput
                label="Course"
                value={(values as LessonValues).courseId}
                onChange={(value) =>
                  setValues((current) => ({
                    ...(current as LessonValues),
                    courseId: value,
                    courseModuleId: "",
                  }))
                }
                options={options.courses.map((item) => ({ value: item.id, label: item.title }))}
              />
              <SelectInput
                label="Module"
                value={(values as LessonValues).courseModuleId}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as LessonValues), courseModuleId: value }))
                }
                options={moduleOptions.map((item) => ({ value: item.id, label: item.title }))}
              />
              <TextInput
                label="Sort order"
                type="number"
                value={(values as LessonValues).sortOrder}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as LessonValues), sortOrder: Number(value) }))
                }
              />
              <TextInput
                label="Estimated minutes"
                type="number"
                value={(values as LessonValues).estimatedMinutes}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as LessonValues), estimatedMinutes: value }))
                }
              />
              <div className="lg:col-span-2">
                <TextAreaInput
                  label="Summary"
                  value={(values as LessonValues).summary}
                  onChange={(value) =>
                    setValues((current) => ({ ...(current as LessonValues), summary: value }))
                  }
                />
              </div>
              <div className="lg:col-span-2">
                <TextAreaInput
                  label="Description"
                  value={(values as LessonValues).description}
                  onChange={(value) =>
                    setValues((current) => ({ ...(current as LessonValues), description: value }))
                  }
                />
              </div>
            </div>
          )}

          {entityType === "QUIZ" && (
            <div className="grid gap-4 lg:grid-cols-2">
              <TextInput
                label="Tiêu đề"
                value={(values as QuizValues).title}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as QuizValues), title: value }))
                }
              />
              <TextInput
                label="Slug"
                value={(values as QuizValues).slug}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as QuizValues), slug: value }))
                }
              />
              <SelectInput
                label="Course"
                value={(values as QuizValues).courseId}
                onChange={(value) =>
                  setValues((current) => ({
                    ...(current as QuizValues),
                    courseId: value,
                    courseModuleId: "",
                    lessonId: "",
                  }))
                }
                options={options.courses.map((item) => ({ value: item.id, label: item.title }))}
              />
              <SelectInput
                label="Module"
                value={(values as QuizValues).courseModuleId}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as QuizValues), courseModuleId: value }))
                }
                options={moduleOptions.map((item) => ({ value: item.id, label: item.title }))}
                placeholder="Không gắn module"
              />
              <SelectInput
                label="Lesson"
                value={(values as QuizValues).lessonId}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as QuizValues), lessonId: value }))
                }
                options={lessonOptions.map((item) => ({ value: item.id, label: item.title }))}
                placeholder="Không gắn lesson"
              />
              <TextInput
                label="Sort order"
                type="number"
                value={(values as QuizValues).sortOrder}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as QuizValues), sortOrder: Number(value) }))
                }
              />
              <TextInput
                label="Passing score"
                type="number"
                value={(values as QuizValues).passingScore}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as QuizValues), passingScore: Number(value) }))
                }
              />
              <TextInput
                label="Time limit minutes"
                type="number"
                value={(values as QuizValues).timeLimitMinutes}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as QuizValues), timeLimitMinutes: value }))
                }
              />
              <TextInput
                label="Max attempts"
                type="number"
                value={(values as QuizValues).maxAttempts}
                onChange={(value) =>
                  setValues((current) => ({ ...(current as QuizValues), maxAttempts: value }))
                }
              />
              <div className="lg:col-span-2">
                <TextAreaInput
                  label="Description"
                  value={(values as QuizValues).description}
                  onChange={(value) =>
                    setValues((current) => ({ ...(current as QuizValues), description: value }))
                  }
                />
              </div>
            </div>
          )}

          {entityType === "LEARNING_PATH" && (
            <CheckboxGroup
              label="Courses trong learning path"
              values={(values as LearningPathValues).courseIds}
              onToggle={toggleLearningPathCourseId}
              options={options.courses.map((item) => ({ value: item.id, label: item.title }))}
            />
          )}

          {entityType === "COURSE" && (
            <CheckboxGroup
              label="Learning paths chứa course này"
              values={(values as CourseValues).learningPathIds}
              onToggle={toggleCourseLearningPathId}
              options={options.learningPaths.map((item) => ({
                value: item.id,
                label: item.title,
              }))}
            />
          )}

          {serverError ? <p className="text-sm text-rose-600">{serverError}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending
                ? "Đang lưu..."
                : mode === "create"
                  ? "Tạo item"
                  : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={() => {
                setValues(defaultValues);
                setServerError(null);
                setSuccessMessage(null);
              }}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
            >
              Reset form
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

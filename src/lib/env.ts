import { z } from "zod";

const serverEnvSchema = z.object({
  APP_URL: z.string().url().default("http://localhost:3000"),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET phải có ít nhất 16 ký tự."),
  AUTH_TRUST_HOST: z.string().optional(),
  DATABASE_URL: z.string().min(1, "DATABASE_URL là bắt buộc."),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL phải là email hợp lệ."),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD phải có ít nhất 8 ký tự."),
  ADMIN_NAME: z.string().min(1).default("Quản trị viên"),
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
});

export function getServerEnv() {
  return serverEnvSchema.parse(process.env);
}

export function getServerEnvSafe() {
  return serverEnvSchema.safeParse(process.env);
}

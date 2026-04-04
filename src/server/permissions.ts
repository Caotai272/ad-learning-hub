import type { Role } from "@prisma/client";

export function isAdmin(role: Role | undefined) {
  return role === "ADMIN";
}

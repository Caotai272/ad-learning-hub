import { hash } from "bcryptjs";
import type { Role } from "@prisma/client";

import type { RegisterInput } from "@/modules/auth/auth.schema";
import { prisma } from "@/server/db";

type PublicUser = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
};

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  const existingUser = await getUserByEmail(input.email);

  if (existingUser) {
    throw new Error("Email này đã được sử dụng.");
  }

  const passwordHash = await hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
      role: "STUDENT",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
}

import { randomBytes } from "node:crypto";

import { compare, hash } from "bcryptjs";
import type { Role } from "@prisma/client";

import type {
  ChangePasswordInput,
  RegisterInput,
  ResetPasswordInput,
} from "@/modules/auth/auth.schema";
import { prisma } from "@/server/db";

type PublicUser = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
};

const RESET_PASSWORD_TTL_MS = 1000 * 60 * 60;

function getAppUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}

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

export async function requestPasswordReset(email: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return {
      resetUrl: null,
      expiresAt: null,
    };
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + RESET_PASSWORD_TTL_MS);

  await prisma.verificationToken.deleteMany({
    where: {
      identifier: email,
    },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  const resetUrl = `${getAppUrl()}/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

  if (process.env.NODE_ENV !== "production") {
    console.log(`Password reset link for ${email}: ${resetUrl}`);
  }

  return {
    resetUrl,
    expiresAt: expires.toISOString(),
  };
}

export async function resetPassword(input: ResetPasswordInput) {
  const tokenRecord = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: input.email,
        token: input.token,
      },
    },
  });

  if (!tokenRecord || tokenRecord.expires < new Date()) {
    throw new Error("Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.");
  }

  const user = await getUserByEmail(input.email);

  if (!user) {
    throw new Error("Tài khoản không tồn tại.");
  }

  const passwordHash = await hash(input.password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
      },
    }),
    prisma.verificationToken.deleteMany({
      where: {
        identifier: input.email,
      },
    }),
  ]);

  return {
    email: user.email,
  };
}

export async function changePassword(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user?.passwordHash) {
    throw new Error("Không thể đổi mật khẩu cho tài khoản này.");
  }

  const isValidPassword = await compare(input.currentPassword, user.passwordHash);

  if (!isValidPassword) {
    throw new Error("Mật khẩu hiện tại chưa đúng.");
  }

  const passwordHash = await hash(input.newPassword, 12);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash,
    },
  });

  return {
    email: user.email,
  };
}

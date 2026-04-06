import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { createAdminToken, verifyAdminToken } from "@/lib/auth-token";
import { adminCookieName } from "@/lib/constants";
import { getRuntimeAuthConfig } from "@/lib/runtime-auth";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;

  if (!token) {
    return null;
  }

  return verifyAdminToken(token);
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function startAdminSession(email: string) {
  const cookieStore = await cookies();
  const token = await createAdminToken(email);

  cookieStore.set(adminCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function endAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(adminCookieName);
}

export function isValidAdminLogin(email: string, password: string) {
  const { email: configuredEmail, password: configuredPassword } = getRuntimeAuthConfig();

  if (!configuredEmail || !configuredPassword) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variables.");
  }

  return safeEqual(email, configuredEmail) && safeEqual(password, configuredPassword);
}

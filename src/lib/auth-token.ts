import { SignJWT, jwtVerify } from "jose";
import { getRuntimeAuthConfig } from "@/lib/runtime-auth";

export type AdminToken = {
  email: string;
  role: "admin";
};

function getAuthSecret() {
  const secret = getRuntimeAuthConfig().secret;
  if (!secret) {
    throw new Error("Missing AUTH_SECRET environment variable.");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminToken(email: string) {
  return new SignJWT({ email, role: "admin" satisfies AdminToken["role"] })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAuthSecret());
}

export async function verifyAdminToken(token: string) {
  try {
    const verified = await jwtVerify<AdminToken>(token, getAuthSecret());
    if (verified.payload.role !== "admin" || !verified.payload.email) {
      return null;
    }
    return verified.payload;
  } catch {
    return null;
  }
}

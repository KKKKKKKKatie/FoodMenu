export function getRuntimeAuthConfig() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    secret: process.env.AUTH_SECRET || (isProduction ? "" : "local-demo-auth-secret"),
    email: process.env.ADMIN_EMAIL || (isProduction ? "" : "admin@example.com"),
    password: process.env.ADMIN_PASSWORD || (isProduction ? "" : "demo123456"),
  };
}

export function hasConfiguredAdminAuth() {
  const config = getRuntimeAuthConfig();
  return Boolean(config.secret && config.email && config.password);
}

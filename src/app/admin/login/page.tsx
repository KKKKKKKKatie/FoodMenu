import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getAdminSession } from "@/lib/auth";
import { hasConfiguredAdminAuth } from "@/lib/runtime-auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  const params = await searchParams;
  const hasError = params.error === "1";
  const usingDemoCredentials = !hasConfiguredAdminAuth();

  return (
    <main className="shell hero">
      <div className="hero__panel" style={{ maxWidth: 680, margin: "0 auto" }}>
        <span className="eyebrow">Admin Login</span>
        <h1 className="hero-title--compact">Admin Sign In</h1>
        <p className="muted">Only admins can access menu editing, session creation, and live order review.</p>

        <AdminLoginForm action={loginAction} hasError={hasError} usingDemoCredentials={usingDemoCredentials} />
      </div>
    </main>
  );
}

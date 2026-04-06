import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
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
      <div className="hero__panel" style={{ maxWidth: 520, margin: "0 auto" }}>
        <span className="eyebrow">Admin Login</span>
        <h1>后台登录</h1>
        <p className="muted">只有管理员能访问菜单编辑、会话创建和实时订单审核。</p>

        <form action={loginAction} className="stack">
          {usingDemoCredentials ? (
            <p className="notice">本地演示登录：admin@example.com / demo123456。配置环境变量后会自动切换。</p>
          ) : null}
          <div className="field">
            <label htmlFor="email">邮箱</label>
            <input id="email" name="email" type="email" placeholder="admin@example.com" required />
          </div>
          <div className="field">
            <label htmlFor="password">密码</label>
            <input id="password" name="password" type="password" required />
          </div>
          {hasError ? <p className="notice">邮箱或密码不正确。</p> : null}
          <button type="submit">登录</button>
        </form>
      </div>
    </main>
  );
}

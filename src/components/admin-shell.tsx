import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="shell hero">
      <div className="hero__panel">
        <div className="admin-shell__topbar">
          <span className="eyebrow">Admin Console</span>
          <form action={logoutAction}>
            <button type="submit" className="button button--accent">
              Logout
            </button>
          </form>
        </div>
        <div className="stack">
          <h1>{title}</h1>
          <p className="muted">{description}</p>
        </div>
        <div className="split-actions">
          <Link href="/admin" className="button button--ghost">
            Dashboard
          </Link>
          <Link href="/admin/menu" className="button button--ghost">
            Menu
          </Link>
          <Link href="/admin/sessions/new" className="button button--ghost">
            New Session
          </Link>
          <Link href="/admin/orders" className="button button--ghost">
            Orders
          </Link>
        </div>
      </div>
      {children}
    </main>
  );
}

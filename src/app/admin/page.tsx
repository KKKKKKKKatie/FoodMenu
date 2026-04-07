import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { countActiveSessions, countMenuItems, countPendingOrders, hasDatabase, listSessions } from "@/lib/data-store";

export default async function AdminDashboardPage() {
  const [menuCount, activeSessionCount, pendingOrderCount, latestSessions] = await Promise.all([
    countMenuItems(),
    countActiveSessions(),
    countPendingOrders(),
    listSessions({ take: 5 }),
  ]);

  return (
    <AdminShell title="Admin Dashboard" description="Manage menu items, open ordering sessions, and review the latest orders here.">
      <section className="stats-grid">
        <div className="kpi">
          <strong>{menuCount}</strong>
          <span>Total Menu Items</span>
        </div>
        <div className="kpi">
          <strong>{activeSessionCount}</strong>
          <span>Active Sessions</span>
        </div>
        <div className="kpi">
          <strong>{pendingOrderCount}</strong>
          <span>Pending Orders</span>
        </div>
      </section>

      <section className="admin-grid">
        <section className="card stack">
          <div className="row">
            <h2>Quick Actions</h2>
          </div>
          <div className="split-actions">
            <Link href="/admin/menu/new" className="button button--accent button--compact">
              Add Menu Item
            </Link>
            <Link href="/admin/sessions/new" className="button button--ghost button--compact">
              Create Session
            </Link>
            <Link href="/admin/orders" className="button button--ghost button--compact">
              View Orders
            </Link>
          </div>
        </section>

        <section className="card stack">
          <div className="row">
            <h2>Recent Sessions</h2>
          </div>
          {!hasDatabase ? (
            <p className="notice">The app is currently using local demo mode. Data is stored in `.data/local-db.json`.</p>
          ) : null}
          <div className="table-list">
            {latestSessions.map((session) => (
              <div key={session.id} className="table-row">
                <strong>{session.name}</strong>
                <p className="muted">/{session.slug}</p>
                <div className="tag-row">
                  <span className={`tag ${session.isActive ? "tag--success" : ""}`}>
                    {session.isActive ? "Active" : "Closed"}
                  </span>
                  <Link href={`/order/${session.slug}`} className="button button--ghost">
                    Open Public Page
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}

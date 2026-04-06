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
    <AdminShell title="管理后台" description="在这里维护菜单、开启点单会话，并查看最新订单。">
      <section className="stats-grid">
        <div className="kpi">
          <strong>{menuCount}</strong>
          <span>菜品总数</span>
        </div>
        <div className="kpi">
          <strong>{activeSessionCount}</strong>
          <span>活跃点单会话</span>
        </div>
        <div className="kpi">
          <strong>{pendingOrderCount}</strong>
          <span>待处理订单</span>
        </div>
      </section>

      <section className="admin-grid">
        <section className="card stack">
          <div className="row">
            <h2>快捷入口</h2>
          </div>
          <div className="split-actions">
            <Link href="/admin/menu/new" className="button button--accent">
              新增菜品
            </Link>
            <Link href="/admin/sessions/new" className="button button--ghost">
              创建点单会话
            </Link>
            <Link href="/admin/orders" className="button button--ghost">
              查看订单
            </Link>
          </div>
        </section>

        <section className="card stack">
          <div className="row">
            <h2>最近会话</h2>
          </div>
          {!hasDatabase ? (
            <p className="notice">当前为本地演示模式。数据保存在项目目录下的 `.data/local-db.json`。</p>
          ) : null}
          <div className="table-list">
            {latestSessions.map((session) => (
              <div key={session.id} className="table-row">
                <strong>{session.name}</strong>
                <p className="muted">/{session.slug}</p>
                <div className="tag-row">
                  <span className={`tag ${session.isActive ? "tag--success" : ""}`}>
                    {session.isActive ? "进行中" : "已关闭"}
                  </span>
                  <Link href={`/order/${session.slug}`} className="button button--ghost">
                    打开前台页面
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

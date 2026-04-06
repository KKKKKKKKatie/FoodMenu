import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell hero">
      <div className="hero__panel" style={{ maxWidth: 720 }}>
        <span className="eyebrow">Not Found</span>
        <h1>这个页面不存在，或者点单会话已经结束。</h1>
        <p className="muted">你可以回到菜单首页，或者让管理员重新开启一个新的点单会话。</p>
        <div className="split-actions">
          <Link href="/" className="button button--accent">
            返回菜单
          </Link>
          <Link href="/admin" className="button button--ghost">
            进入后台
          </Link>
        </div>
      </div>
    </main>
  );
}

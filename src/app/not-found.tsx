import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell hero">
      <div className="hero__panel" style={{ maxWidth: 720 }}>
        <span className="eyebrow">Not Found</span>
        <h1>This page does not exist, or the ordering session has already ended.</h1>
        <p className="muted">You can go back to the menu homepage or ask an admin to open a new ordering session.</p>
        <div className="split-actions">
          <Link href="/" className="button button--accent">
            Back to Menu
          </Link>
          <Link href="/admin" className="button button--ghost">
            Open Admin
          </Link>
        </div>
      </div>
    </main>
  );
}

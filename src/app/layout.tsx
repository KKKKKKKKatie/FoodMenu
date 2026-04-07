import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";
import { BackButton } from "@/components/back-button";
import { getAdminSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Food Menu System",
  description: "Menu management and ordering system for shared meal planning.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminSession = await getAdminSession();

  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="shell site-header__inner">
            <Link href="/" className="brand">
              <strong>Food Menu</strong>
              <span>Menu management, ordering sessions, and review tools</span>
            </Link>
            <nav className="nav-links">
              <Link href="/">Menu</Link>
              <Link href="/admin">Admin</Link>
              {adminSession ? <span className="tag tag--success">Admin: {adminSession.email}</span> : null}
            </nav>
          </div>
        </header>
        <div className="shell page-topbar">
          <BackButton />
        </div>
        {children}
      </body>
    </html>
  );
}

import { notFound } from "next/navigation";
import { OrderSessionClient } from "@/components/order-session-client";
import { getSessionBySlug, listMenuItems } from "@/lib/data-store";

export default async function OrderSessionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSessionBySlug(slug);

  const now = new Date();

  if (
    !session ||
    !session.isActive ||
    session.startsAt > now ||
    (session.endsAt !== null && session.endsAt < now)
  ) {
    notFound();
  }

  const menuItems = (await listMenuItems()).filter((item) => item.isAvailable);

  return (
    <main className="shell hero">
      <div className="hero__panel">
        <span className="eyebrow">Ordering Session</span>
        <h1>{session.name}</h1>
        <p className="muted">{session.description || "先把想吃的菜加入购物车，再统一提交订单。"}</p>
      </div>

      <OrderSessionClient
        sessionId={session.id}
        sessionSlug={session.slug}
        sessionName={session.name}
        menuItems={menuItems}
      />
    </main>
  );
}

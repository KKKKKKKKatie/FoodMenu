import { notFound } from "next/navigation";
import { OrderSessionClient } from "@/components/order-session-client";
import { getSessionBySlug, listMenuItems, listOrdersBySession } from "@/lib/data-store";

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

  const [menuItems, initialOrders] = await Promise.all([
    listMenuItems(),
    listOrdersBySession(session.id),
  ]);
  const availableItems = menuItems.filter((item) => item.isAvailable);

  return (
    <main className="shell hero">
      <div className="hero__panel">
        <span className="eyebrow">Ordering Session</span>
        <h1>{session.name}</h1>
        <p className="muted">{session.description || "Add the dishes you want to the cart first, then submit the order together."}</p>
      </div>

      <OrderSessionClient
        sessionId={session.id}
        sessionSlug={session.slug}
        sessionName={session.name}
        menuItems={availableItems}
        initialOrders={initialOrders}
      />
    </main>
  );
}

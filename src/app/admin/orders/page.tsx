import { AdminShell } from "@/components/admin-shell";
import { OrdersBoard } from "@/components/orders-board";
import { listOrders } from "@/lib/data-store";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <AdminShell title="Live Orders" description="The admin panel polls for the latest orders and lets admins reject unavailable items one by one.">
      <OrdersBoard initialOrders={orders} />
    </AdminShell>
  );
}

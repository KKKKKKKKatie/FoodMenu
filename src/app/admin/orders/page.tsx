import { AdminShell } from "@/components/admin-shell";
import { OrdersBoard } from "@/components/orders-board";
import { listOrders } from "@/lib/data-store";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <AdminShell title="实时订单" description="后台会轮询最新订单，并允许管理员逐项拒绝无法供应的菜品。">
      <OrdersBoard initialOrders={orders} />
    </AdminShell>
  );
}

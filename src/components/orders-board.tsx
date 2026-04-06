"use client";

import { OrderItemStatus, OrderStatus } from "@prisma/client";
import { useEffect, useState } from "react";
import { orderItemStatusLabels, orderStatusLabels } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";

type DashboardOrder = {
  id: string;
  customerName: string;
  note: string | null;
  status: OrderStatus;
  createdAt: string;
  session: {
    name: string;
  };
  items: Array<{
    id: string;
    itemName: string;
    quantity: number;
    note: string | null;
    unitPriceCents: number;
    status: OrderItemStatus;
    rejectionReason: string | null;
  }>;
};

export function OrdersBoard({ initialOrders }: { initialOrders: DashboardOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as { orders: DashboardOrder[] };
      if (!cancelled) {
        setOrders(payload.orders);
      }
    };

    fetchOrders();
    const timer = setInterval(fetchOrders, 5000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  async function updateItemStatus(orderItemId: string, status: OrderItemStatus) {
    const rejectionReason =
      status === "REJECTED" ? window.prompt("拒绝原因（例如：食材缺货）") ?? "暂不可用" : undefined;

    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderItemId, status, rejectionReason }),
    });

    if (!response.ok) {
      setMessage("更新失败，请稍后刷新后重试。");
      return;
    }

    const payload = (await response.json()) as { orders: DashboardOrder[] };
    setOrders(payload.orders);
    setMessage("订单状态已更新。");
  }

  return (
    <div className="stack">
      {message ? <div className="notice">{message}</div> : null}
      <div className="order-board">
        <div className="row">
          <h2>实时订单面板</h2>
          <span className="tag">每 5 秒刷新</span>
        </div>

        <div className="table-list">
          {orders.length === 0 ? <p className="muted">当前还没有订单。</p> : null}
          {orders.map((order) => (
            <article key={order.id} className="table-row">
              <div className="row">
                <div className="stack">
                  <strong>
                    {order.customerName} · {order.session.name}
                  </strong>
                  <span className="status-pill">{orderStatusLabels[order.status]}</span>
                </div>
                <span className="muted">{new Date(order.createdAt).toLocaleString()}</span>
              </div>

              {order.note ? <p className="muted">整单备注：{order.note}</p> : null}

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item stack">
                    <div className="row">
                      <strong>
                        {item.itemName} x {item.quantity}
                      </strong>
                      <span>{formatCurrency(item.unitPriceCents * item.quantity)}</span>
                    </div>
                    <span className="status-pill">{orderItemStatusLabels[item.status]}</span>
                    {item.note ? <span className="muted">备注：{item.note}</span> : null}
                    {item.rejectionReason ? <span className="muted">原因：{item.rejectionReason}</span> : null}
                    <div className="split-actions">
                      <button type="button" className="button button--ghost" onClick={() => updateItemStatus(item.id, "APPROVED")}>
                        确认可做
                      </button>
                      <button type="button" className="button button--ghost" onClick={() => updateItemStatus(item.id, "REJECTED")}>
                        拒绝 / 缺货
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

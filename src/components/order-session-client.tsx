"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { orderItemStatusLabels, orderStatusLabels } from "@/lib/constants";
import type { MenuItemRecord, SessionOrderRecord } from "@/lib/data-store";
import { MenuVisual } from "@/components/menu-visual";

type CartEntry = {
  menuItemId: string;
  quantity: number;
  note: string;
};

type MenuOrderItem = Pick<
  MenuItemRecord,
  "id" | "name" | "chineseName" | "description" | "imageUrl" | "isAvailable" | "ingredientTags"
>;

type CartDisplayEntry = CartEntry & {
  item: MenuOrderItem;
};

const storedIdentityKey = "foodmenu_order_name";

function readStoredIdentity() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(storedIdentityKey) || "";
}

export function OrderSessionClient({
  sessionId,
  sessionSlug,
  sessionName,
  menuItems,
  initialOrders,
}: {
  sessionId: string;
  sessionSlug: string;
  sessionName: string;
  menuItems: MenuOrderItem[];
  initialOrders: SessionOrderRecord[];
}) {
  const [customerName, setCustomerName] = useState(readStoredIdentity);
  const [savedName, setSavedName] = useState(readStoredIdentity);
  const [orderNote, setOrderNote] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState<Record<string, CartEntry>>({});
  const [orders, setOrders] = useState(initialOrders);

  const cartItems = useMemo(
    () =>
      Object.values(cart)
        .map((entry) => {
          const item = menuItems.find((candidate) => candidate.id === entry.menuItemId);
          return item ? { ...entry, item } : null;
        })
        .filter((entry): entry is CartDisplayEntry => entry !== null),
    [cart, menuItems],
  );

  function updateQuantity(menuItemId: string, delta: number) {
    setCart((current) => {
      const existing = current[menuItemId] ?? { menuItemId, quantity: 0, note: "" };
      const quantity = Math.max(0, existing.quantity + delta);

      if (quantity === 0) {
        const next = { ...current };
        delete next[menuItemId];
        return next;
      }

      return {
        ...current,
        [menuItemId]: {
          ...existing,
          quantity,
        },
      };
    });
  }

  function changeItemNote(menuItemId: string, note: string) {
    setCart((current) => {
      const existing = current[menuItemId];
      if (!existing) {
        return current;
      }

      return {
        ...current,
        [menuItemId]: {
          ...existing,
          note,
        },
      };
    });
  }

  async function submitOrder() {
    const checkoutName = customerName.trim();
    if (!checkoutName) {
      setStatus("Please enter your name before ordering.");
      return;
    }

    if (cartItems.length === 0) {
      setStatus("Your cart is still empty. Add a few dishes first.");
      return;
    }

    setSubmitting(true);
    setStatus("");

    if (typeof window !== "undefined") {
      window.localStorage.setItem(storedIdentityKey, checkoutName);
      setSavedName(checkoutName);
    }

    const response = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        customerName: checkoutName,
        customerMode: "member",
        note: orderNote,
        items: cartItems.map((entry) => ({
          menuItemId: entry.item.id,
          quantity: entry.quantity,
          note: entry.note,
        })),
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus(payload?.error ?? "Submission failed. Please try again.");
      setSubmitting(false);
      return;
    }

    setStatus(`Your order has been submitted to ${sessionName}. The admin dashboard will see it right away.`);
    setCart({});
    setOrderNote("");
    setSubmitting(false);
    const refreshResponse = await fetch(`/api/order/session/${sessionSlug}`, { cache: "no-store" });
    if (refreshResponse.ok) {
      const refreshPayload = (await refreshResponse.json()) as { orders: SessionOrderRecord[] };
      setOrders(refreshPayload.orders);
    }
  }

  useEffect(() => {
    const refreshOrders = async () => {
      const response = await fetch(`/api/order/session/${sessionSlug}`, { cache: "no-store" });
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { orders: SessionOrderRecord[] };
      setOrders(payload.orders);
    };

    void refreshOrders();
    const timer = window.setInterval(() => {
      void refreshOrders();
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [sessionSlug]);

  return (
    <div className="order-layout">
      <section className="stack">
        <div className="form-panel stack">
          <div className="row">
            <h2>Your Order</h2>
            {savedName ? <span className="tag tag--success">Saved name: {savedName}</span> : null}
          </div>

          <div className="field">
            <label htmlFor="customerName">Your Name</label>
            <input
              id="customerName"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="For example: Katie"
            />
          </div>
          <p className="muted">
            Submitted orders appear below so everyone can see what has already been requested.
          </p>
        </div>

        <div className="row">
          <h2>Add to Cart</h2>
          <span className="tag">{menuItems.length} dishes</span>
        </div>

        <div className="menu-grid">
          {menuItems.map((item) => {
            const entry = cart[item.id];
            return (
              <article key={item.id} className="card menu-order-card">
                <MenuVisual title={item.chineseName || item.name} imageUrl={item.imageUrl} compact />
                <div className="stack">
                  <div className="row">
                    <div className="stack">
                      <h3>{item.chineseName || item.name}</h3>
                      <p className="muted">{item.description || "Open the detail page to view more information."}</p>
                    </div>
                  </div>

                  {item.ingredientTags.length > 0 ? (
                    <p className="muted">Ingredients: {item.ingredientTags.join(", ")}</p>
                  ) : null}

                  <div className="split-actions">
                    <Link href={`/menu/${item.id}?session=${sessionSlug}`} className="button button--ghost">
                      View Details
                    </Link>
                    <button type="button" className="button button--accent" onClick={() => updateQuantity(item.id, 1)}>
                      Add to Cart
                    </button>
                  </div>

                  {entry ? (
                    <div className="cart-inline stack">
                      <div className="split-actions">
                        <button type="button" className="button button--ghost" onClick={() => updateQuantity(item.id, -1)}>
                          -1
                        </button>
                        <span className="tag">Added {entry.quantity}</span>
                        <button type="button" className="button button--ghost" onClick={() => updateQuantity(item.id, 1)}>
                          +1
                        </button>
                      </div>
                      <div className="field">
                        <label htmlFor={`item-note-${item.id}`}>Item Note</label>
                        <input
                          id={`item-note-${item.id}`}
                          value={entry.note}
                          onChange={(event) => changeItemNote(item.id, event.target.value)}
                          placeholder="For example: less spicy, no scallions"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="form-panel cart-panel stack">
        <div className="row">
          <h2>Cart</h2>
          <span className="tag">{cartItems.length} items</span>
        </div>

        {cartItems.length === 0 ? <p className="muted">Choose a few dishes from the left and your cart will appear here.</p> : null}

        <div className="cart-list">
          {cartItems.map((entry) => {
            if (!entry) {
              return null;
            }

            return (
              <div key={entry.item.id} className="cart-item">
                <strong>{entry.item.chineseName || entry.item.name}</strong>
                <div className="split-actions">
                  <button type="button" className="button button--ghost" onClick={() => updateQuantity(entry.item.id, -1)}>
                    -
                  </button>
                  <span className="tag">x {entry.quantity}</span>
                  <button type="button" className="button button--ghost" onClick={() => updateQuantity(entry.item.id, 1)}>
                    +
                  </button>
                </div>
                {entry.note ? <p className="muted">Note: {entry.note}</p> : null}
              </div>
            );
          })}
        </div>

        <div className="field">
          <label htmlFor="orderNote">Order Note</label>
          <textarea
            id="orderNote"
            value={orderNote}
            onChange={(event) => setOrderNote(event.target.value)}
            placeholder="For example: separate packaging, pickup at 7 PM"
          />
        </div>

        {status ? <p className="notice">{status}</p> : null}

        <button type="button" onClick={submitOrder} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Cart"}
        </button>
      </aside>

      <section className="form-panel stack order-session-feed">
        <div className="row">
          <h2>Shared Orders</h2>
          <span className="tag">{orders.length} submitted</span>
        </div>

        {orders.length === 0 ? (
          <p className="muted">No one has submitted an order yet. You can be the first.</p>
        ) : (
          <div className="table-list">
            {orders.map((order) => (
              <article key={order.id} className="table-row">
                <div className="row">
                  <div className="stack">
                    <strong>{order.customerName}</strong>
                    <span className="status-pill">{orderStatusLabels[order.status]}</span>
                  </div>
                  <span className="muted">{new Date(order.createdAt).toLocaleString()}</span>
                </div>

                {order.note ? <p className="muted">Order note: {order.note}</p> : null}

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item stack">
                    <div className="row">
                      <strong>
                        {item.itemName} x {item.quantity}
                      </strong>
                    </div>
                      <span className="status-pill">{orderItemStatusLabels[item.status]}</span>
                      {item.note ? <span className="muted">Note: {item.note}</span> : null}
                      {item.rejectionReason ? <span className="muted">Reason: {item.rejectionReason}</span> : null}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

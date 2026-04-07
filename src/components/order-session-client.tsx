"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MenuItemRecord } from "@/lib/data-store";
import { formatCurrency } from "@/lib/format";
import { MenuVisual } from "@/components/menu-visual";

type CartEntry = {
  menuItemId: string;
  quantity: number;
  note: string;
};

type MenuOrderItem = Pick<
  MenuItemRecord,
  "id" | "name" | "chineseName" | "description" | "priceCents" | "imageUrl" | "isAvailable" | "ingredientTags"
>;

type CartDisplayEntry = CartEntry & {
  item: MenuOrderItem;
};

const storedIdentityKey = "foodmenu_identity_name";

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
}: {
  sessionId: string;
  sessionSlug: string;
  sessionName: string;
  menuItems: MenuOrderItem[];
}) {
  const [identityMode, setIdentityMode] = useState<"member" | "guest">("member");
  const [memberName, setMemberName] = useState(readStoredIdentity);
  const [guestName, setGuestName] = useState("");
  const [savedName, setSavedName] = useState(readStoredIdentity);
  const [orderNote, setOrderNote] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState<Record<string, CartEntry>>({});

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

  const total = cartItems.reduce((sum, entry) => {
    if (!entry) {
      return sum;
    }
    return sum + entry.item.priceCents * entry.quantity;
  }, 0);

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

  function getCheckoutName() {
    return identityMode === "member" ? memberName.trim() : guestName.trim();
  }

  async function submitOrder() {
    const checkoutName = getCheckoutName();
    if (!checkoutName) {
      setStatus(identityMode === "member" ? "Please enter a member name first." : "Please enter a guest name.");
      return;
    }

    if (cartItems.length === 0) {
      setStatus("Your cart is still empty. Add a few dishes first.");
      return;
    }

    setSubmitting(true);
    setStatus("");

    if (identityMode === "member" && typeof window !== "undefined") {
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
        customerMode: identityMode,
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
    if (identityMode === "guest") {
      setGuestName("");
    }
    setSubmitting(false);
  }

  return (
    <div className="order-layout">
      <section className="stack">
        <div className="form-panel stack">
          <div className="row">
            <h2>Identity</h2>
            {savedName ? <span className="tag tag--success">Saved member: {savedName}</span> : null}
          </div>

          <div className="segmented-control">
            <button
              type="button"
              className={`button ${identityMode === "member" ? "button--accent" : "button--ghost"}`}
              onClick={() => setIdentityMode("member")}
            >
              Member
            </button>
            <button
              type="button"
              className={`button ${identityMode === "guest" ? "button--accent" : "button--ghost"}`}
              onClick={() => setIdentityMode("guest")}
            >
              Guest
            </button>
          </div>

          {identityMode === "member" ? (
            <div className="field">
              <label htmlFor="memberName">Member Name</label>
              <input
                id="memberName"
                value={memberName}
                onChange={(event) => setMemberName(event.target.value)}
                placeholder="For example: Katie"
              />
            </div>
          ) : (
            <div className="field">
              <label htmlFor="guestName">Guest Name</label>
              <input
                id="guestName"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="For example: Alex (Guest)"
              />
            </div>
          )}
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
                    <strong>{formatCurrency(item.priceCents)}</strong>
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
                <div className="row">
                  <strong>{entry.item.chineseName || entry.item.name}</strong>
                  <span>{formatCurrency(entry.item.priceCents * entry.quantity)}</span>
                </div>
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

        <div className="row cart-total">
          <strong>Total</strong>
          <strong>{formatCurrency(total)}</strong>
        </div>

        {status ? <p className="notice">{status}</p> : null}

        <button type="button" onClick={submitOrder} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Cart"}
        </button>
      </aside>
    </div>
  );
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder, getSessionById, listMenuItems } from "@/lib/data-store";

const orderSchema = z.object({
  sessionId: z.string().min(1),
  customerName: z.string().min(1),
  customerMode: z.enum(["member", "guest"]).default("guest"),
  note: z.string().optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().min(1),
        note: z.string().optional(),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = orderSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order payload." }, { status: 400 });
  }

  const session = await getSessionById(parsed.data.sessionId);

  if (!session || !session.isActive) {
    return NextResponse.json({ error: "The current ordering session is unavailable." }, { status: 400 });
  }

  const menuItems = (await listMenuItems()).filter(
    (item) =>
      item.isAvailable && parsed.data.items.some((selectedItem) => selectedItem.menuItemId === item.id),
  );

  if (menuItems.length !== parsed.data.items.length) {
    return NextResponse.json({ error: "Some dishes are no longer available. Please refresh and try again." }, { status: 400 });
  }

  await createOrder({
    sessionId: parsed.data.sessionId,
    customerName:
      parsed.data.customerMode === "guest"
        ? `${parsed.data.customerName.trim()} (Guest)`
        : parsed.data.customerName.trim(),
    customerMode: parsed.data.customerMode,
    note: parsed.data.note?.trim() || null,
    items: parsed.data.items.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      note: item.note?.trim() || null,
    })),
  });

  return NextResponse.json({ ok: true });
}

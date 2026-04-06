import { OrderItemStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { listOrders, updateOrderItemStatus } from "@/lib/data-store";

async function requireApiAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

async function getDashboardOrders() {
  return listOrders();
}

export async function GET() {
  const unauthorized = await requireApiAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  return NextResponse.json({ orders: await getDashboardOrders() });
}

const patchSchema = z.object({
  orderItemId: z.string().min(1),
  status: z.nativeEnum(OrderItemStatus),
  rejectionReason: z.string().optional(),
});

export async function PATCH(request: Request) {
  const unauthorized = await requireApiAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json();
  const parsed = patchSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await updateOrderItemStatus({
    orderItemId: parsed.data.orderItemId,
    status: parsed.data.status,
    rejectionReason: parsed.data.rejectionReason,
  });

  return NextResponse.json({ orders: await getDashboardOrders() });
}

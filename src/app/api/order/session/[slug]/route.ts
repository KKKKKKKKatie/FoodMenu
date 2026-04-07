import { NextResponse } from "next/server";
import { getSessionBySlug, listOrdersBySession } from "@/lib/data-store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const session = await getSessionBySlug(slug);

  if (!session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  const orders = await listOrdersBySession(session.id);
  return NextResponse.json({ orders });
}

import Link from "next/link";
import type { MenuItemRecord } from "@/lib/data-store";
import { MenuVisual } from "@/components/menu-visual";

export function MenuSummaryCard({
  item,
}: {
  item: Pick<MenuItemRecord, "id" | "name" | "chineseName" | "description" | "imageUrl">;
}) {
  return (
    <Link href={`/menu/${item.id}`} className="card menu-summary-card">
      <MenuVisual title={item.chineseName || item.name} imageUrl={item.imageUrl} />
      <div className="stack">
        <h3>{item.chineseName || item.name}</h3>
        <p className="muted">{item.description || "点击查看详细介绍、食材和做法信息。"}</p>
      </div>
    </Link>
  );
}

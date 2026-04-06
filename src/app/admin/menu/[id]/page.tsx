import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { MenuItemForm } from "@/components/menu-item-form";
import { saveMenuItemAction } from "@/app/admin/actions";
import { getMenuItemById } from "@/lib/data-store";

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getMenuItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <AdminShell title="编辑菜品" description="你可以调整可用状态、更新 recipe，或者补充食材标签。">
      <MenuItemForm item={item} action={saveMenuItemAction} />
    </AdminShell>
  );
}

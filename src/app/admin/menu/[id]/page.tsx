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
    <AdminShell title="Edit Menu Item" description="You can update availability, edit recipe notes, or add more ingredient tags.">
      <MenuItemForm item={item} action={saveMenuItemAction} />
    </AdminShell>
  );
}

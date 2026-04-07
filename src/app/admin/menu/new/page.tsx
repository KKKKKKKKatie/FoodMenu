import { AdminShell } from "@/components/admin-shell";
import { MenuItemForm } from "@/components/menu-item-form";
import { saveMenuItemAction } from "@/app/admin/actions";

export default function NewMenuItemPage() {
  return (
    <AdminShell title="Add Menu Item" description="When you create a new dish, you can also set categories, ingredients, spice level, and recipe notes.">
      <MenuItemForm action={saveMenuItemAction} />
    </AdminShell>
  );
}

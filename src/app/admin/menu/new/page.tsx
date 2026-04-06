import { AdminShell } from "@/components/admin-shell";
import { MenuItemForm } from "@/components/menu-item-form";
import { saveMenuItemAction } from "@/app/admin/actions";

export default function NewMenuItemPage() {
  return (
    <AdminShell title="新增菜品" description="录入新菜品时，可以同时维护分类、食材、辣度和 recipe 备注。">
      <MenuItemForm action={saveMenuItemAction} />
    </AdminShell>
  );
}

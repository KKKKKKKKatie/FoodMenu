import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { toggleMenuItemAvailabilityAction } from "@/app/admin/actions";
import { complexityLabels, cookingMethodLabels, spiceLevelLabels } from "@/lib/constants";
import { listMenuItems } from "@/lib/data-store";
import { formatCurrency } from "@/lib/format";

export default async function AdminMenuPage() {
  const items = await listMenuItems();

  return (
    <AdminShell title="菜单维护" description="管理员可以修改菜品、做法备注、标签和上架状态。">
      <div className="split-actions">
        <Link href="/admin/menu/new" className="button button--accent">
          新增菜品
        </Link>
      </div>

      <section className="menu-grid">
        {items.map((item) => (
          <article key={item.id} className="card menu-card">
            <div className="menu-card__header">
              <div className="stack">
                <h2>{item.chineseName || item.name}</h2>
                <p className="muted">{item.description || "暂无描述"}</p>
              </div>
              <strong>{formatCurrency(item.priceCents)}</strong>
            </div>

            <div className="tag-row">
              {item.categories.map((category) => (
                <span key={category} className="tag">
                  {category}
                </span>
              ))}
              <span className="tag">{spiceLevelLabels[item.spiceLevel]}</span>
              <span className="tag">{complexityLabels[item.complexity]}</span>
              <span className="tag">{cookingMethodLabels[item.cookingMethod]}</span>
            </div>

            {item.recipe ? <p className="muted">Recipe: {item.recipe.title}</p> : null}
            <p className="muted">食材：{item.ingredientTags.join("、") || "未设置"}</p>

            <div className="split-actions">
              <Link href={`/admin/menu/${item.id}`} className="button button--ghost">
                编辑
              </Link>
              <form action={toggleMenuItemAvailabilityAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="nextValue" value={String(!item.isAvailable)} />
                <button type="submit" className="button button--ghost">
                  {item.isAvailable ? "下架" : "上架"}
                </button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}

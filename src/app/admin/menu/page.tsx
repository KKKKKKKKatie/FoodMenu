import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { toggleMenuItemAvailabilityAction } from "@/app/admin/actions";
import { complexityLabels, cookingMethodLabels, spiceLevelLabels } from "@/lib/constants";
import { listMenuItems } from "@/lib/data-store";
import { formatCurrency } from "@/lib/format";

export default async function AdminMenuPage() {
  const items = await listMenuItems();

  return (
    <AdminShell title="Menu Management" description="Admins can update dishes, recipe notes, tags, and availability.">
      <div className="split-actions">
        <Link href="/admin/menu/new" className="button button--accent">
          Add Menu Item
        </Link>
      </div>

      <section className="menu-grid">
        {items.map((item) => (
          <article key={item.id} className="card menu-card">
            <div className="menu-card__header">
              <div className="stack">
                <h2>{item.chineseName || item.name}</h2>
                <p className="muted">{item.description || "No description yet."}</p>
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
            <p className="muted">Ingredients: {item.ingredientTags.join(", ") || "Not set"}</p>

            <div className="split-actions">
              <Link href={`/admin/menu/${item.id}`} className="button button--ghost">
                Edit
              </Link>
              <form action={toggleMenuItemAvailabilityAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="nextValue" value={String(!item.isAvailable)} />
                <button type="submit" className="button button--ghost">
                  {item.isAvailable ? "Hide" : "Publish"}
                </button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}

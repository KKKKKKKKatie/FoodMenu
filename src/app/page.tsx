import { Complexity, CookingMethod, SpiceLevel } from "@prisma/client";
import { MenuFilters } from "@/components/menu-filters";
import { MenuSummaryCard } from "@/components/menu-summary-card";
import { hasDatabase } from "@/lib/data-store";
import { getFilterOptions, getMenuItems } from "@/lib/menu";

function pickEnumValue<T extends string>(value: string | undefined, options: Record<string, T>) {
  if (!value) {
    return undefined;
  }

  return Object.values(options).includes(value as T) ? (value as T) : undefined;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : undefined;
  const ingredient = typeof params.ingredient === "string" ? params.ingredient : undefined;
  const spiceLevel = pickEnumValue(
    typeof params.spiceLevel === "string" ? params.spiceLevel : undefined,
    SpiceLevel,
  );
  const complexity = pickEnumValue(
    typeof params.complexity === "string" ? params.complexity : undefined,
    Complexity,
  );
  const cookingMethod = pickEnumValue(
    typeof params.cookingMethod === "string" ? params.cookingMethod : undefined,
    CookingMethod,
  );

  const [items, options] = await Promise.all([
    getMenuItems({ category, ingredient, spiceLevel, complexity, cookingMethod }),
    getFilterOptions(),
  ]);

  return (
    <main className="shell">
      <section className="hero">
        <div className="stack">
          <div className="row">
            <h1>Current Menu</h1>
            <span className="tag">{items.length} items</span>
          </div>

          <p className="muted">
            Browse dishes, narrow the list with filters, and open any item to see more details.
          </p>
        </div>

        <MenuFilters
          categories={options.categories}
          ingredients={options.ingredients}
          current={{
            category,
            ingredient,
            spiceLevel,
            complexity,
            cookingMethod,
          }}
        />

        <div className="menu-grid">
          {items.map((item) => (
            <MenuSummaryCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <p className="footer-note">
        Image upload is currently kept as an optional URL field. If you want local uploads after deployment, you can
        connect Vercel Blob or Supabase Storage.
        {!hasDatabase ? " The app is currently using local JSON demo data and will switch to PostgreSQL when DATABASE_URL is configured." : ""}
      </p>
    </main>
  );
}

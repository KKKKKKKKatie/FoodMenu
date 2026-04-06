import { Complexity, CookingMethod, SpiceLevel } from "@prisma/client";
import Link from "next/link";
import { MenuFilters } from "@/components/menu-filters";
import { MenuSummaryCard } from "@/components/menu-summary-card";
import { hasDatabase, listSessions } from "@/lib/data-store";
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

  const [items, options, sessions] = await Promise.all([
    getMenuItems({ category, ingredient, spiceLevel, complexity, cookingMethod }),
    getFilterOptions(),
    listSessions({ activeOnly: true, take: 3 }),
  ]);

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero__panel">
          <span className="eyebrow">Shared Kitchen</span>
          <h1>让菜单维护、开单和后台审核都在一个系统里完成。</h1>
          <p className="muted">
            这个版本支持后台维护菜品、按分类和食材筛选、开启点单会话，以及管理员实时审核订单是否可做。
          </p>
          <div className="split-actions">
            {sessions.map((session) => (
              <Link key={session.id} href={`/order/${session.slug}`} className="button button--accent">
                去 {session.name} 点单
              </Link>
            ))}
            <Link href="/admin" className="button button--ghost">
              进入后台
            </Link>
          </div>
        </div>
      </section>

      <section className="layout-grid">
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

        <div className="stack">
          <div className="row">
            <h2>当前菜单</h2>
            <span className="tag">{items.length} 道菜</span>
          </div>

          <div className="menu-grid">
            {items.map((item) => (
              <MenuSummaryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <p className="footer-note">
        图片上传目前保留为可选 URL 字段，部署后如果你想加本地上传，我们可以直接接上 Vercel Blob 或 Supabase Storage。
        {!hasDatabase ? " 当前正在使用本地 JSON 演示数据；配置 DATABASE_URL 后会自动切换到 PostgreSQL。" : ""}
      </p>
    </main>
  );
}

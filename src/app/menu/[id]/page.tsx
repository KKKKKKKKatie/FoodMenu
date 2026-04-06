import { Complexity, CookingMethod, SpiceLevel } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MenuVisual } from "@/components/menu-visual";
import { complexityLabels, cookingMethodLabels, spiceLevelLabels } from "@/lib/constants";
import { getMenuItemById, listSessions } from "@/lib/data-store";
import { formatCurrency } from "@/lib/format";

export default async function MenuDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const sessionSlug = typeof query.session === "string" ? query.session : undefined;
  const item = await getMenuItemById(id);

  if (!item) {
    notFound();
  }

  const sessions = await listSessions({ activeOnly: true, take: 3 });
  const linkedSession = sessions.find((session) => session.slug === sessionSlug);

  return (
    <main className="shell hero">
      <section className="detail-layout">
        <div className="detail-visual-panel">
          <MenuVisual title={item.chineseName || item.name} imageUrl={item.imageUrl} />
        </div>

        <div className="hero__panel detail-copy">
          <span className="eyebrow">Menu Detail</span>
          <h1>{item.chineseName || item.name}</h1>
          <p className="muted">{item.description || "这道菜目前还没有补充更多介绍。"}</p>

          <div className="tag-row">
            {item.categories.map((categoryValue) => (
              <span key={categoryValue} className="tag">
                {categoryValue}
              </span>
            ))}
            <span className="tag">{spiceLevelLabels[item.spiceLevel as SpiceLevel]}</span>
            <span className="tag">{complexityLabels[item.complexity as Complexity]}</span>
            <span className="tag">{cookingMethodLabels[item.cookingMethod as CookingMethod]}</span>
            <span className={`tag ${item.isAvailable ? "tag--success" : "tag--danger"}`}>
              {item.isAvailable ? "可点单" : "暂不可点"}
            </span>
          </div>

          <div className="detail-price-row">
            <strong>{formatCurrency(item.priceCents)}</strong>
            <div className="split-actions">
              <Link href="/" className="button button--ghost">
                返回首页
              </Link>
              {linkedSession ? (
                <Link href={`/order/${linkedSession.slug}`} className="button button--accent">
                  回到 {linkedSession.name} 点单
                </Link>
              ) : sessions[0] ? (
                <Link href={`/order/${sessions[0].slug}`} className="button button--accent">
                  去点单
                </Link>
              ) : null}
            </div>
          </div>

          {item.ingredientTags.length > 0 ? (
            <div className="stack">
              <h3>主要食材</h3>
              <p>{item.ingredientTags.join("、")}</p>
            </div>
          ) : null}

          {item.recipe ? (
            <div className="stack">
              <h3>{item.recipe.title}</h3>
              {item.recipe.ingredientNotes ? <p className="muted">{item.recipe.ingredientNotes}</p> : null}
              {item.recipe.steps ? <p>{item.recipe.steps}</p> : null}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

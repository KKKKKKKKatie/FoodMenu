"use client";

import Link from "next/link";
import { useState } from "react";
import { complexityLabels, cookingMethodLabels, spiceLevelLabels } from "@/lib/constants";

export function MenuFilters({
  categories,
  ingredients,
  current,
}: {
  categories: string[];
  ingredients: string[];
  current: {
    category?: string;
    ingredient?: string;
    spiceLevel?: string;
    complexity?: string;
    cookingMethod?: string;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="filter-card filter-card--shell">
      <div className="filter-card__head">
        <div className="stack">
          <h2>筛选菜单</h2>
          <p className="muted">在手机上可以先收起筛选，专心浏览菜品卡片。</p>
        </div>
        <button
          type="button"
          className="button button--ghost filter-card__toggle"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "收起筛选" : "打开筛选"}
        </button>
      </div>

      <form className={`filter-form filter-form--drawer ${open ? "is-open" : ""}`} method="get">
        <div className="field">
          <label htmlFor="category">分类</label>
          <select id="category" name="category" defaultValue={current.category ?? ""}>
            <option value="">全部</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="ingredient">食材</label>
          <select id="ingredient" name="ingredient" defaultValue={current.ingredient ?? ""}>
            <option value="">全部</option>
            {ingredients.map((ingredient) => (
              <option key={ingredient} value={ingredient}>
                {ingredient}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="spiceLevel">辣度</label>
          <select id="spiceLevel" name="spiceLevel" defaultValue={current.spiceLevel ?? ""}>
            <option value="">全部</option>
            {Object.entries(spiceLevelLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="complexity">复杂程度</label>
          <select id="complexity" name="complexity" defaultValue={current.complexity ?? ""}>
            <option value="">全部</option>
            {Object.entries(complexityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="cookingMethod">做法</label>
          <select id="cookingMethod" name="cookingMethod" defaultValue={current.cookingMethod ?? ""}>
            <option value="">全部</option>
            {Object.entries(cookingMethodLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="split-actions">
          <button type="submit">应用筛选</button>
          <Link href="/" className="button button--ghost">
            清空
          </Link>
        </div>
      </form>
    </aside>
  );
}

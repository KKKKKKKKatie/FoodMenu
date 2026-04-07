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
          <h2>Filters</h2>
        </div>
        <button
          type="button"
          className="button button--ghost filter-card__toggle"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <form className={`filter-form filter-form--drawer ${open ? "is-open" : ""}`} method="get">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue={current.category ?? ""}>
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="ingredient">Ingredient</label>
          <select id="ingredient" name="ingredient" defaultValue={current.ingredient ?? ""}>
            <option value="">All</option>
            {ingredients.map((ingredient) => (
              <option key={ingredient} value={ingredient}>
                {ingredient}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="spiceLevel">Spice Level</label>
          <select id="spiceLevel" name="spiceLevel" defaultValue={current.spiceLevel ?? ""}>
            <option value="">All</option>
            {Object.entries(spiceLevelLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="complexity">Complexity</label>
          <select id="complexity" name="complexity" defaultValue={current.complexity ?? ""}>
            <option value="">All</option>
            {Object.entries(complexityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="cookingMethod">Cooking Method</label>
          <select id="cookingMethod" name="cookingMethod" defaultValue={current.cookingMethod ?? ""}>
            <option value="">All</option>
            {Object.entries(cookingMethodLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="split-actions">
          <button type="submit">Apply Filters</button>
          <Link href="/" className="button button--ghost">
            Reset
          </Link>
        </div>
      </form>
    </aside>
  );
}

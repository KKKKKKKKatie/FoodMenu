import { Complexity, CookingMethod, SpiceLevel } from "@prisma/client";
import { categorySuggestions, complexityLabels, cookingMethodLabels, spiceLevelLabels } from "@/lib/constants";

type MenuItemWithRecipe = {
  id: string;
  name: string;
  chineseName: string | null;
  description: string | null;
  priceCents: number;
  isAvailable: boolean;
  spiceLevel: SpiceLevel;
  complexity: Complexity;
  cookingMethod: CookingMethod;
  categories: string[];
  ingredientTags: string[];
  imageUrl: string | null;
  recipe: {
    title: string;
    ingredientNotes: string | null;
    steps: string | null;
  } | null;
};

export function MenuItemForm({
  item,
  action,
}: {
  item?: MenuItemWithRecipe | null;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="form-panel stack">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="row">
        <h2>{item ? "Edit Menu Item" : "Add Menu Item"}</h2>
        <span className="tag">{item ? "Update" : "Create"}</span>
      </div>

      <div className="field">
        <label htmlFor="name">Display Name</label>
        <input id="name" name="name" defaultValue={item?.name ?? ""} required />
      </div>

      <div className="field">
        <label htmlFor="chineseName">Chinese Name</label>
        <input id="chineseName" name="chineseName" defaultValue={item?.chineseName ?? ""} />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" defaultValue={item?.description ?? ""} />
      </div>

      <input id="priceCents" name="priceCents" type="hidden" value={String(item?.priceCents ?? 0)} />

      <div className="field">
        <label htmlFor="categories">Categories (comma-separated)</label>
        <input
          id="categories"
          name="categories"
          defaultValue={item?.categories.join(", ") ?? ""}
          placeholder={categorySuggestions.join(", ")}
        />
      </div>

      <div className="field">
        <label htmlFor="ingredientTags">Ingredient Tags (comma-separated)</label>
        <input
          id="ingredientTags"
          name="ingredientTags"
          defaultValue={item?.ingredientTags.join(", ") ?? ""}
        />
      </div>

      <div className="field">
        <label htmlFor="spiceLevel">Spice Level</label>
        <select id="spiceLevel" name="spiceLevel" defaultValue={item?.spiceLevel ?? SpiceLevel.NONE}>
          {Object.entries(spiceLevelLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="complexity">Complexity</label>
        <select id="complexity" name="complexity" defaultValue={item?.complexity ?? Complexity.STANDARD}>
          {Object.entries(complexityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="cookingMethod">Cooking Method</label>
        <select
          id="cookingMethod"
          name="cookingMethod"
          defaultValue={item?.cookingMethod ?? CookingMethod.OTHER}
        >
          {Object.entries(cookingMethodLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="imageUrl">Image URL (optional)</label>
        <input id="imageUrl" name="imageUrl" defaultValue={item?.imageUrl ?? ""} />
      </div>

      <div className="split-actions">
        <label className="tag">
          <input type="checkbox" name="isAvailable" defaultChecked={item?.isAvailable ?? true} /> Available for ordering
        </label>
      </div>

      <div className="stack">
        <h3>Recipe Notes</h3>
        <div className="field">
          <label htmlFor="recipeTitle">Section Title</label>
          <input id="recipeTitle" name="recipeTitle" defaultValue={item?.recipe?.title ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="recipeIngredients">Ingredient Notes</label>
          <textarea
            id="recipeIngredients"
            name="recipeIngredients"
            defaultValue={item?.recipe?.ingredientNotes ?? ""}
          />
        </div>
      </div>

      <button type="submit">Save Menu Item</button>
    </form>
  );
}

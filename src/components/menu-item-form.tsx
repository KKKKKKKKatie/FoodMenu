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
        <h2>{item ? "编辑菜品" : "新增菜品"}</h2>
        <span className="tag">{item ? "Update" : "Create"}</span>
      </div>

      <div className="field">
        <label htmlFor="name">显示名称</label>
        <input id="name" name="name" defaultValue={item?.name ?? ""} required />
      </div>

      <div className="field">
        <label htmlFor="chineseName">中文名称</label>
        <input id="chineseName" name="chineseName" defaultValue={item?.chineseName ?? ""} />
      </div>

      <div className="field">
        <label htmlFor="description">描述</label>
        <textarea id="description" name="description" defaultValue={item?.description ?? ""} />
      </div>

      <div className="field">
        <label htmlFor="priceCents">价格（分）</label>
        <input id="priceCents" name="priceCents" type="number" min="0" defaultValue={item?.priceCents ?? 0} required />
      </div>

      <div className="field">
        <label htmlFor="categories">分类（逗号分隔）</label>
        <input
          id="categories"
          name="categories"
          defaultValue={item?.categories.join(", ") ?? ""}
          placeholder={categorySuggestions.join(", ")}
        />
      </div>

      <div className="field">
        <label htmlFor="ingredientTags">食材标签（逗号分隔）</label>
        <input
          id="ingredientTags"
          name="ingredientTags"
          defaultValue={item?.ingredientTags.join(", ") ?? ""}
        />
      </div>

      <div className="field">
        <label htmlFor="spiceLevel">辣度</label>
        <select id="spiceLevel" name="spiceLevel" defaultValue={item?.spiceLevel ?? SpiceLevel.NONE}>
          {Object.entries(spiceLevelLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="complexity">复杂程度</label>
        <select id="complexity" name="complexity" defaultValue={item?.complexity ?? Complexity.STANDARD}>
          {Object.entries(complexityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="cookingMethod">做法</label>
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
        <label htmlFor="imageUrl">图片 URL（可选）</label>
        <input id="imageUrl" name="imageUrl" defaultValue={item?.imageUrl ?? ""} />
      </div>

      <div className="split-actions">
        <label className="tag">
          <input type="checkbox" name="isAvailable" defaultChecked={item?.isAvailable ?? true} /> 可点单
        </label>
      </div>

      <div className="stack">
        <h3>Recipe / 做法备注</h3>
        <div className="field">
          <label htmlFor="recipeTitle">小标题</label>
          <input id="recipeTitle" name="recipeTitle" defaultValue={item?.recipe?.title ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="recipeIngredients">配料说明</label>
          <textarea
            id="recipeIngredients"
            name="recipeIngredients"
            defaultValue={item?.recipe?.ingredientNotes ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="recipeSteps">步骤 / 预处理说明</label>
          <textarea id="recipeSteps" name="recipeSteps" defaultValue={item?.recipe?.steps ?? ""} />
        </div>
      </div>

      <button type="submit">保存菜品</button>
    </form>
  );
}

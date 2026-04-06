import { Complexity, CookingMethod, SpiceLevel } from "@prisma/client";
import { getMenuFilterOptions, listMenuItems } from "@/lib/data-store";

export type MenuFilters = {
  category?: string;
  ingredient?: string;
  spiceLevel?: SpiceLevel;
  complexity?: Complexity;
  cookingMethod?: CookingMethod;
};

export async function getMenuItems(filters: MenuFilters = {}) {
  return listMenuItems(filters);
}

export async function getFilterOptions() {
  return getMenuFilterOptions();
}

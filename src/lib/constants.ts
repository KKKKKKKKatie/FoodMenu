import { Complexity, CookingMethod, SpiceLevel } from "@prisma/client";

export const adminCookieName = "foodmenu_admin_session";

export const categorySuggestions = [
  "Hot Dish",
  "Cold Dish",
  "Meat",
  "Vegetarian",
  "Soup",
  "Staple",
  "Dessert",
];

export const spiceLevelLabels: Record<SpiceLevel, string> = {
  NONE: "Not Spicy",
  MILD: "Mild",
  MEDIUM: "Medium",
  HOT: "Hot",
  EXTREME: "Extra Hot",
};

export const complexityLabels: Record<Complexity, string> = {
  SIMPLE: "Simple",
  STANDARD: "Standard",
  COMPLEX: "Complex / Labor Intensive",
};

export const cookingMethodLabels: Record<CookingMethod, string> = {
  STIR_FRY: "Stir Fry",
  BRAISE: "Braise",
  STEW: "Stew",
  COLD_DISH: "Cold Dish",
  STEAM: "Steam",
  DEEP_FRY: "Deep Fry",
  OTHER: "Other",
};

export const orderStatusLabels = {
  PENDING: "Pending",
  APPROVED: "Approved",
  PARTIAL: "Partially Rejected",
  REJECTED: "Rejected",
  FULFILLED: "Fulfilled",
} as const;

export const orderItemStatusLabels = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected / Unavailable",
} as const;

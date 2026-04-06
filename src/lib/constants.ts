import { Complexity, CookingMethod, SpiceLevel } from "@prisma/client";

export const adminCookieName = "foodmenu_admin_session";

export const categorySuggestions = [
  "热菜",
  "凉菜",
  "荤菜",
  "素菜",
  "汤",
  "主食",
  "甜品",
];

export const spiceLevelLabels: Record<SpiceLevel, string> = {
  NONE: "不辣",
  MILD: "微辣",
  MEDIUM: "中辣",
  HOT: "辣",
  EXTREME: "特辣",
};

export const complexityLabels: Record<Complexity, string> = {
  SIMPLE: "简单",
  STANDARD: "普通",
  COMPLEX: "复杂 / 费工",
};

export const cookingMethodLabels: Record<CookingMethod, string> = {
  STIR_FRY: "炒菜",
  BRAISE: "红烧",
  STEW: "炖菜",
  COLD_DISH: "凉菜",
  STEAM: "蒸菜",
  DEEP_FRY: "炸物",
  OTHER: "其他",
};

export const orderStatusLabels = {
  PENDING: "待处理",
  APPROVED: "已确认",
  PARTIAL: "部分拒绝",
  REJECTED: "已拒绝",
  FULFILLED: "已完成",
} as const;

export const orderItemStatusLabels = {
  PENDING: "待处理",
  APPROVED: "可制作",
  REJECTED: "缺货 / 拒绝",
} as const;

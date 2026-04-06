"use server";

import { Complexity, CookingMethod, SpiceLevel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { endAdminSession, isValidAdminLogin, requireAdmin, startAdminSession } from "@/lib/auth";
import { createSession, saveMenuItem, toggleMenuItemAvailability } from "@/lib/data-store";
import { slugify, splitTags } from "@/lib/format";

const menuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  chineseName: z.string().optional(),
  description: z.string().optional(),
  priceCents: z.coerce.number().int().min(0),
  isAvailable: z.boolean().default(false),
  spiceLevel: z.nativeEnum(SpiceLevel),
  complexity: z.nativeEnum(Complexity),
  cookingMethod: z.nativeEnum(CookingMethod),
  categories: z.string().default(""),
  ingredientTags: z.string().default(""),
  imageUrl: z.string().url().optional().or(z.literal("")),
  recipeTitle: z.string().optional(),
  recipeIngredients: z.string().optional(),
  recipeSteps: z.string().optional(),
});

const sessionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().optional(),
  startsAt: z.string().min(1),
  endsAt: z.string().optional(),
  isActive: z.boolean().default(false),
});

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isValidAdminLogin(email, password)) {
    redirect("/admin/login?error=1");
  }

  await startAdminSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  await endAdminSession();
  redirect("/admin/login");
}

export async function saveMenuItemAction(formData: FormData) {
  await requireAdmin();

  const parsed = menuItemSchema.parse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    chineseName: formData.get("chineseName") || undefined,
    description: formData.get("description") || undefined,
    priceCents: formData.get("priceCents"),
    isAvailable: formData.get("isAvailable") === "on",
    spiceLevel: formData.get("spiceLevel"),
    complexity: formData.get("complexity"),
    cookingMethod: formData.get("cookingMethod"),
    categories: formData.get("categories") ?? "",
    ingredientTags: formData.get("ingredientTags") ?? "",
    imageUrl: formData.get("imageUrl") ?? "",
    recipeTitle: formData.get("recipeTitle") || undefined,
    recipeIngredients: formData.get("recipeIngredients") || undefined,
    recipeSteps: formData.get("recipeSteps") || undefined,
  });

  const baseData = {
    name: parsed.name,
    chineseName: parsed.chineseName || null,
    description: parsed.description || null,
    priceCents: parsed.priceCents,
    isAvailable: parsed.isAvailable,
    spiceLevel: parsed.spiceLevel,
    complexity: parsed.complexity,
    cookingMethod: parsed.cookingMethod,
    categories: splitTags(parsed.categories),
    ingredientTags: splitTags(parsed.ingredientTags),
    imageUrl: parsed.imageUrl || null,
  };

  const recipe =
    parsed.recipeTitle || parsed.recipeIngredients || parsed.recipeSteps
      ? {
          title: parsed.recipeTitle || `${parsed.name} 做法`,
          ingredientNotes: parsed.recipeIngredients || null,
          steps: parsed.recipeSteps || null,
        }
      : null;

  await saveMenuItem({
    id: parsed.id,
    ...baseData,
    recipe,
  });

  revalidatePath("/");
  revalidatePath("/admin/menu");
  revalidatePath(`/admin/menu/${parsed.id ?? ""}`);
  redirect("/admin/menu");
}

export async function toggleMenuItemAvailabilityAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const nextValue = formData.get("nextValue") === "true";

  await toggleMenuItemAvailability(id, nextValue);

  revalidatePath("/");
  revalidatePath("/admin/menu");
}

export async function createSessionAction(formData: FormData) {
  await requireAdmin();

  const parsed = sessionSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    slug: formData.get("slug") || undefined,
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
    isActive: formData.get("isActive") === "on",
  });

  await createSession({
    name: parsed.name,
    description: parsed.description || null,
    slug: parsed.slug ? slugify(parsed.slug) : slugify(parsed.name),
    startsAt: new Date(parsed.startsAt),
    endsAt: parsed.endsAt ? new Date(parsed.endsAt) : null,
    isActive: parsed.isActive,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  redirect("/admin");
}

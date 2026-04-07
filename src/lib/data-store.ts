import { promises as fs } from "node:fs";
import path from "node:path";
import {
  Complexity,
  CookingMethod,
  OrderItemStatus,
  OrderStatus,
  SpiceLevel,
} from "@prisma/client";
import { db } from "@/lib/db";
import { slugify } from "@/lib/format";
import type { MenuFilters } from "@/lib/menu";

type RecipeRecord = {
  id: string;
  menuItemId: string;
  title: string;
  ingredientNotes: string | null;
  steps: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MenuItemRecord = {
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
  recipe: RecipeRecord | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderSessionRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderItemRecord = {
  id: string;
  orderId: string;
  menuItemId: string;
  itemName: string;
  quantity: number;
  note: string | null;
  unitPriceCents: number;
  status: OrderItemStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderRecord = {
  id: string;
  sessionId: string;
  customerName: string;
  note: string | null;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItemRecord[];
};

type LocalData = {
  menuItems: MenuItemRecord[];
  sessions: OrderSessionRecord[];
  orders: OrderRecord[];
};

const dataFilePath = path.join(process.cwd(), ".data", "local-db.json");

export const hasDatabase = Boolean(process.env.DATABASE_URL);

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function getSeedData(): LocalData {
  const now = nowIso();
  const menuItemId1 = createId("menu");
  const menuItemId2 = createId("menu");
  const menuItemId3 = createId("menu");
  const sessionId = createId("session");

  return {
    menuItems: [
      {
        id: menuItemId1,
        name: "Twice Cooked Pork",
        chineseName: null,
        description: "Pork belly stir-fried with peppers and chili bean paste. Great with rice.",
        priceCents: 3800,
        isAvailable: true,
        spiceLevel: SpiceLevel.MEDIUM,
        complexity: Complexity.STANDARD,
        cookingMethod: CookingMethod.STIR_FRY,
        categories: ["Hot Dish", "Meat"],
        ingredientTags: ["Pork Belly", "Green Pepper"],
        imageUrl: null,
        recipe: {
          id: createId("recipe"),
          menuItemId: menuItemId1,
          title: "Homestyle Stir Fry",
          ingredientNotes: "Boil first, then stir-fry for a rich but not greasy result.",
          steps: "Partially boil the pork belly, slice it, then stir-fry with green pepper.",
          createdAt: now,
          updatedAt: now,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: menuItemId2,
        name: "Braised Cabbage",
        chineseName: null,
        description: "Tangy and lightly spicy cabbage, great for sharing.",
        priceCents: 2200,
        isAvailable: true,
        spiceLevel: SpiceLevel.MILD,
        complexity: Complexity.SIMPLE,
        cookingMethod: CookingMethod.STIR_FRY,
        categories: ["Hot Dish", "Vegetarian"],
        ingredientTags: ["Cabbage", "Dried Chili"],
        imageUrl: null,
        recipe: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: menuItemId3,
        name: "Slow Stewed Beef",
        chineseName: null,
        description: "Tender beef stew with rich flavor, ideal for family-style meals.",
        priceCents: 5600,
        isAvailable: true,
        spiceLevel: SpiceLevel.NONE,
        complexity: Complexity.COMPLEX,
        cookingMethod: CookingMethod.STEW,
        categories: ["Hot Dish", "Meat"],
        ingredientTags: ["Beef Brisket", "Daikon"],
        imageUrl: null,
        recipe: {
          id: createId("recipe"),
          menuItemId: menuItemId3,
          title: "Signature Slow Stew",
          ingredientNotes: "Stew brisket and daikon together until tender and flavorful.",
          steps: "Blanch first, then simmer over low heat for at least 90 minutes.",
          createdAt: now,
          updatedAt: now,
        },
        createdAt: now,
        updatedAt: now,
      },
    ],
    sessions: [
      {
        id: sessionId,
        name: "This Week's Trial Menu",
        slug: "demo-session",
        description: "Local demo session. When DATABASE_URL is missing, the app will automatically use local JSON data.",
        isActive: true,
        startsAt: now,
        endsAt: null,
        createdAt: now,
        updatedAt: now,
      },
    ],
    orders: [],
  };
}

async function readLocalData() {
  try {
    const raw = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(raw) as LocalData;
  } catch {
    const seed = getSeedData();
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(seed, null, 2));
    return seed;
  }
}

async function writeLocalData(data: LocalData) {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function listMenuItems(filters: MenuFilters = {}) {
  if (hasDatabase) {
    return db.menuItem.findMany({
      where: {
        ...(filters.category ? { categories: { has: filters.category } } : {}),
        ...(filters.ingredient ? { ingredientTags: { has: filters.ingredient } } : {}),
        ...(filters.spiceLevel ? { spiceLevel: filters.spiceLevel } : {}),
        ...(filters.complexity ? { complexity: filters.complexity } : {}),
        ...(filters.cookingMethod ? { cookingMethod: filters.cookingMethod } : {}),
      },
      include: { recipe: true },
      orderBy: [{ isAvailable: "desc" }, { updatedAt: "desc" }],
    });
  }

  const data = await readLocalData();
  return data.menuItems
    .filter((item) => (filters.category ? item.categories.includes(filters.category) : true))
    .filter((item) => (filters.ingredient ? item.ingredientTags.includes(filters.ingredient) : true))
    .filter((item) => (filters.spiceLevel ? item.spiceLevel === filters.spiceLevel : true))
    .filter((item) => (filters.complexity ? item.complexity === filters.complexity : true))
    .filter((item) => (filters.cookingMethod ? item.cookingMethod === filters.cookingMethod : true))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function getMenuFilterOptions() {
  const items = await listMenuItems();
  const categories = Array.from(new Set(items.flatMap((item) => item.categories))).sort();
  const ingredients = Array.from(new Set(items.flatMap((item) => item.ingredientTags))).sort();
  return { categories, ingredients };
}

export async function countMenuItems() {
  if (hasDatabase) {
    return db.menuItem.count();
  }
  const data = await readLocalData();
  return data.menuItems.length;
}

export async function getMenuItemById(id: string) {
  if (hasDatabase) {
    return db.menuItem.findUnique({
      where: { id },
      include: { recipe: true },
    });
  }
  const data = await readLocalData();
  return data.menuItems.find((item) => item.id === id) ?? null;
}

export async function saveMenuItem(input: {
  id?: string;
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
  recipe:
    | {
        title: string;
        ingredientNotes: string | null;
        steps: string | null;
      }
    | null;
}) {
  if (hasDatabase) {
    if (input.id) {
      const { id, recipe, ...baseData } = input;
      await db.menuItem.update({
        where: { id },
        data: {
          ...baseData,
        },
      });

      if (recipe) {
        await db.recipe.upsert({
          where: { menuItemId: id },
          update: recipe,
          create: {
            menuItemId: id,
            ...recipe,
          },
        });
      } else {
        await db.recipe.deleteMany({ where: { menuItemId: id } });
      }
      return;
    }

    await db.menuItem.create({
      data: {
        name: input.name,
        chineseName: input.chineseName,
        description: input.description,
        priceCents: input.priceCents,
        isAvailable: input.isAvailable,
        spiceLevel: input.spiceLevel,
        complexity: input.complexity,
        cookingMethod: input.cookingMethod,
        categories: input.categories,
        ingredientTags: input.ingredientTags,
        imageUrl: input.imageUrl,
        ...(input.recipe ? { recipe: { create: input.recipe } } : {}),
      },
    });
    return;
  }

  const data = await readLocalData();
  const timestamp = nowIso();

  if (input.id) {
    data.menuItems = data.menuItems.map((item) =>
      item.id === input.id
        ? {
            ...item,
            ...input,
            recipe: input.recipe
              ? {
                  id: item.recipe?.id ?? createId("recipe"),
                  menuItemId: item.id,
                  ...input.recipe,
                  createdAt: item.recipe?.createdAt ?? timestamp,
                  updatedAt: timestamp,
                }
              : null,
            updatedAt: timestamp,
          }
        : item,
    );
  } else {
    const id = createId("menu");
    data.menuItems.unshift({
      id,
      ...input,
      recipe: input.recipe
        ? {
            id: createId("recipe"),
            menuItemId: id,
            ...input.recipe,
            createdAt: timestamp,
            updatedAt: timestamp,
          }
        : null,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  await writeLocalData(data);
}

export async function toggleMenuItemAvailability(id: string, nextValue: boolean) {
  if (hasDatabase) {
    await db.menuItem.update({
      where: { id },
      data: { isAvailable: nextValue },
    });
    return;
  }

  const data = await readLocalData();
  data.menuItems = data.menuItems.map((item) =>
    item.id === id ? { ...item, isAvailable: nextValue, updatedAt: nowIso() } : item,
  );
  await writeLocalData(data);
}

export async function listSessions(options?: { activeOnly?: boolean; take?: number }) {
  if (hasDatabase) {
    return db.orderSession.findMany({
      where: options?.activeOnly ? { isActive: true } : undefined,
      orderBy: { startsAt: "desc" },
      take: options?.take,
    });
  }

  const data = await readLocalData();
  const filtered = options?.activeOnly ? data.sessions.filter((session) => session.isActive) : data.sessions;
  return filtered.slice(0, options?.take);
}

export async function countActiveSessions() {
  if (hasDatabase) {
    return db.orderSession.count({ where: { isActive: true } });
  }
  const data = await readLocalData();
  return data.sessions.filter((session) => session.isActive).length;
}

export async function createSession(input: {
  name: string;
  description: string | null;
  slug?: string;
  startsAt: Date;
  endsAt: Date | null;
  isActive: boolean;
}) {
  const sessionSlug = input.slug ? slugify(input.slug) : slugify(input.name);

  if (hasDatabase) {
    await db.orderSession.create({
      data: {
        name: input.name,
        description: input.description,
        slug: sessionSlug,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        isActive: input.isActive,
      },
    });
    return;
  }

  const data = await readLocalData();
  const timestamp = nowIso();
  data.sessions.unshift({
    id: createId("session"),
    name: input.name,
    slug: sessionSlug,
    description: input.description,
    isActive: input.isActive,
    startsAt: input.startsAt.toISOString(),
    endsAt: input.endsAt?.toISOString() ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  await writeLocalData(data);
}

export async function getSessionBySlug(slug: string) {
  if (hasDatabase) {
    return db.orderSession.findUnique({ where: { slug } });
  }
  const data = await readLocalData();
  return data.sessions.find((session) => session.slug === slug) ?? null;
}

export async function getSessionById(id: string) {
  if (hasDatabase) {
    return db.orderSession.findUnique({ where: { id } });
  }
  const data = await readLocalData();
  return data.sessions.find((session) => session.id === id) ?? null;
}

export async function countPendingOrders() {
  if (hasDatabase) {
    return db.order.count({ where: { status: "PENDING" } });
  }
  const data = await readLocalData();
  return data.orders.filter((order) => order.status === "PENDING").length;
}

export async function listOrders() {
  if (hasDatabase) {
    const orders = await db.order.findMany({
      include: {
        session: {
          select: { name: true },
        },
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return orders.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      note: order.note,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      session: {
        name: order.session.name,
      },
      items: order.items.map((item) => ({
        id: item.id,
        itemName: item.itemName,
        quantity: item.quantity,
        note: item.note,
        unitPriceCents: item.unitPriceCents,
        status: item.status,
        rejectionReason: item.rejectionReason,
      })),
    }));
  }

  const data = await readLocalData();
  return data.orders
    .map((order) => {
      const session = data.sessions.find((candidate) => candidate.id === order.sessionId);
      return {
        id: order.id,
        customerName: order.customerName,
        note: order.note,
        status: order.status,
        createdAt: order.createdAt,
        session: {
          name: session?.name ?? "Unknown Session",
        },
        items: order.items.map((item) => ({
          id: item.id,
          itemName: item.itemName,
          quantity: item.quantity,
          note: item.note,
          unitPriceCents: item.unitPriceCents,
          status: item.status,
          rejectionReason: item.rejectionReason,
        })),
      };
    })
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 30);
}

export async function createOrder(input: {
  sessionId: string;
  customerName: string;
  customerMode: "member" | "guest";
  note: string | null;
  items: Array<{
    menuItemId: string;
    quantity: number;
    note: string | null;
  }>;
}) {
  if (hasDatabase) {
    const menuItems = await db.menuItem.findMany({
      where: {
        id: { in: input.items.map((item) => item.menuItemId) },
      },
    });

    await db.order.create({
      data: {
        sessionId: input.sessionId,
        customerName: input.customerName,
        note: input.note,
        status: OrderStatus.PENDING,
        items: {
          create: input.items.map((item) => {
            const menuItem = menuItems.find((candidate) => candidate.id === item.menuItemId);
            return {
              menuItemId: item.menuItemId,
              itemName: menuItem?.chineseName || menuItem?.name || "Menu Item",
              quantity: item.quantity,
              note: item.note,
              unitPriceCents: menuItem?.priceCents || 0,
            };
          }),
        },
      },
    });
    return;
  }

  const data = await readLocalData();
  const timestamp = nowIso();
  const orderId = createId("order");

  const items = input.items.map((item) => {
    const menuItem = data.menuItems.find((candidate) => candidate.id === item.menuItemId);
    return {
      id: createId("orderItem"),
      orderId,
      menuItemId: item.menuItemId,
      itemName: menuItem?.chineseName || menuItem?.name || "Menu Item",
      quantity: item.quantity,
      note: item.note,
      unitPriceCents: menuItem?.priceCents || 0,
      status: OrderItemStatus.PENDING,
      rejectionReason: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });

  data.orders.unshift({
    id: orderId,
    sessionId: input.sessionId,
    customerName: input.customerName,
    note: input.note,
    status: OrderStatus.PENDING,
    createdAt: timestamp,
    updatedAt: timestamp,
    items,
  });

  await writeLocalData(data);
}

export async function updateOrderItemStatus(input: {
  orderItemId: string;
  status: OrderItemStatus;
  rejectionReason?: string;
}) {
  if (hasDatabase) {
    const updatedItem = await db.orderItem.update({
      where: { id: input.orderItemId },
      data: {
        status: input.status,
        rejectionReason: input.status === "REJECTED" ? input.rejectionReason || "Unavailable" : null,
      },
      select: { orderId: true },
    });

    const relatedItems = await db.orderItem.findMany({
      where: { orderId: updatedItem.orderId },
      select: { status: true },
    });

    let nextOrderStatus: OrderStatus = "PENDING";
    if (relatedItems.every((item) => item.status === "APPROVED")) {
      nextOrderStatus = "APPROVED";
    } else if (relatedItems.every((item) => item.status === "REJECTED")) {
      nextOrderStatus = "REJECTED";
    } else if (relatedItems.some((item) => item.status === "REJECTED")) {
      nextOrderStatus = "PARTIAL";
    }

    await db.order.update({
      where: { id: updatedItem.orderId },
      data: { status: nextOrderStatus },
    });
    return;
  }

  const data = await readLocalData();
  const timestamp = nowIso();

  data.orders = data.orders.map((order) => {
    const items = order.items.map((item) =>
      item.id === input.orderItemId
        ? {
            ...item,
            status: input.status,
            rejectionReason: input.status === "REJECTED" ? input.rejectionReason || "Unavailable" : null,
            updatedAt: timestamp,
          }
        : item,
    );

    let nextOrderStatus: OrderStatus = "PENDING";
    if (items.every((item) => item.status === "APPROVED")) {
      nextOrderStatus = "APPROVED";
    } else if (items.every((item) => item.status === "REJECTED")) {
      nextOrderStatus = "REJECTED";
    } else if (items.some((item) => item.status === "REJECTED")) {
      nextOrderStatus = "PARTIAL";
    }

    return {
      ...order,
      items,
      status: nextOrderStatus,
      updatedAt: timestamp,
    };
  });

  await writeLocalData(data);
}

import { prisma } from "@/lib/prisma";
import { AttributeType, Prisma } from "@prisma/client";

export type CatalogFilters = {
  budget?: string;
  filling?: string;
  fruit?: string;
  dough?: string;
  category?: string;
};

export async function getCatalogData(filters: CatalogFilters) {
  const [categories, budgets, fillings, fruits, doughs] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.budgetBucket.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.attributeOption.findMany({
      where: { type: AttributeType.FILLING },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.attributeOption.findMany({
      where: { type: AttributeType.FRUIT },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.attributeOption.findMany({
      where: { type: AttributeType.DOUGH },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (filters.category) {
    where.category = { slug: filters.category };
  }

  if (filters.budget) {
    const bucket = budgets.find((b) => b.id === filters.budget);
    if (bucket) {
      where.priceThousands = {
        gte: bucket.minThousands,
        ...(bucket.maxThousands != null ? { lte: bucket.maxThousands } : {}),
      };
    }
  }

  const optionIds = [filters.filling, filters.fruit, filters.dough].filter(
    Boolean,
  ) as string[];

  if (optionIds.length) {
    where.AND = optionIds.map((optionId) => ({
      attributes: { some: { optionId } },
    }));
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true, attributes: { include: { option: true } } },
    orderBy: [{ sortOrder: "asc" }, { nameRu: "asc" }],
  });

  return { categories, budgets, fillings, fruits, doughs, products };
}

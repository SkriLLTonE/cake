"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { AttributeType } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const nameRu = String(formData.get("nameRu") ?? "");
  const nameUz = String(formData.get("nameUz") ?? nameRu);
  const size = String(formData.get("size") ?? "BIG");
  const priceRaw = String(formData.get("priceThousands") ?? "");
  const priceThousands = priceRaw === "" ? null : Number(priceRaw);
  const isPublished = formData.get("isPublished") === "on";
  const categoryId = String(formData.get("categoryId"));
  const optionIds = formData.getAll("optionIds").map(String);

  let imageUrl: string | undefined;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    imageUrl = await saveUpload(file);
  }

  await prisma.product.update({
    where: { id },
    data: {
      nameRu,
      nameUz,
      size,
      priceThousands: Number.isFinite(priceThousands as number)
        ? (priceThousands as number)
        : null,
      isPublished,
      categoryId,
      ...(imageUrl ? { imageUrl } : {}),
      attributes: {
        deleteMany: {},
        create: optionIds.map((optionId) => ({ optionId })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/ru/catalog");
  revalidatePath("/uz/catalog");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const nameRu = String(formData.get("nameRu") ?? "");
  const nameUz = String(formData.get("nameUz") ?? nameRu);
  const size = String(formData.get("size") ?? "BIG");
  const priceRaw = String(formData.get("priceThousands") ?? "");
  const priceThousands = priceRaw === "" ? null : Number(priceRaw);
  const isPublished = formData.get("isPublished") === "on";
  const categoryId = String(formData.get("categoryId"));
  const file = formData.get("image");
  let imageUrl = "/img/logo2.png";
  if (file instanceof File && file.size > 0) {
    imageUrl = await saveUpload(file);
  }

  await prisma.product.create({
    data: {
      nameRu,
      nameUz,
      size,
      priceThousands: Number.isFinite(priceThousands as number)
        ? (priceThousands as number)
        : null,
      isPublished,
      categoryId,
      imageUrl,
    },
  });

  revalidatePath("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function upsertCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const data = {
    slug: String(formData.get("slug")),
    nameRu: String(formData.get("nameRu")),
    nameUz: String(formData.get("nameUz")),
    descriptionRu: String(formData.get("descriptionRu") ?? ""),
    descriptionUz: String(formData.get("descriptionUz") ?? ""),
  };
  if (id) {
    await prisma.category.update({ where: { id }, data });
  } else {
    await prisma.category.create({ data });
  }
  revalidatePath("/admin/categories");
}

export async function upsertAttribute(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const data = {
    type: String(formData.get("type")) as AttributeType,
    nameRu: String(formData.get("nameRu")),
    nameUz: String(formData.get("nameUz")),
  };
  if (id) {
    await prisma.attributeOption.update({ where: { id }, data });
  } else {
    await prisma.attributeOption.create({ data });
  }
  revalidatePath("/admin/attributes");
}

export async function deleteAttribute(formData: FormData) {
  await requireAdmin();
  await prisma.attributeOption.delete({
    where: { id: String(formData.get("id")) },
  });
  revalidatePath("/admin/attributes");
}

export async function upsertBudget(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const maxRaw = String(formData.get("maxThousands") ?? "");
  const data = {
    labelRu: String(formData.get("labelRu")),
    labelUz: String(formData.get("labelUz")),
    minThousands: Number(formData.get("minThousands")),
    maxThousands: maxRaw === "" ? null : Number(maxRaw),
  };
  if (id) {
    await prisma.budgetBucket.update({ where: { id }, data });
  } else {
    await prisma.budgetBucket.create({ data });
  }
  revalidatePath("/admin/budgets");
}

export async function deleteBudget(formData: FormData) {
  await requireAdmin();
  await prisma.budgetBucket.delete({
    where: { id: String(formData.get("id")) },
  });
  revalidatePath("/admin/budgets");
}

async function saveUpload(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const name = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}

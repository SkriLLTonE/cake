import { PrismaClient, AttributeType } from "@prisma/client";
import bcrypt from "bcryptjs";
import products from "./seed-products.json";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@candy.cake";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  const collection = await prisma.category.upsert({
    where: { slug: "collection" },
    update: {},
    create: {
      slug: "collection",
      nameRu: "Collection",
      nameUz: "Kolleksiya",
      descriptionRu:
        "От лаконичных бенто-тортов до роскошных свадебных шедевров. Выберите десерт, который сделает ваш день особенным!",
      descriptionUz:
        "Ixcham bento tortlardan hashamatli to'y desertlarigacha. Kunni maxsus qiladigan desertni tanlang!",
      sortOrder: 1,
    },
  });

  const bento = await prisma.category.upsert({
    where: { slug: "bento" },
    update: {},
    create: {
      slug: "bento",
      nameRu: "Bento",
      nameUz: "Bento",
      descriptionRu:
        "Персональный мини-торт на 1–2 персоны с вашим индивидуальным дизайном или смешной надписью.",
      descriptionUz:
        "1–2 kishi uchun shaxsiy mini-tort — o'z dizayningiz yoki kulgili yozuv bilan.",
      sortOrder: 2,
    },
  });

  await prisma.budgetBucket.deleteMany();
  await prisma.budgetBucket.createMany({
    data: [
      {
        labelRu: "100–500 тыс.",
        labelUz: "100–500 ming",
        minThousands: 100,
        maxThousands: 500,
        sortOrder: 1,
      },
      {
        labelRu: "500–1000 тыс.",
        labelUz: "500–1000 ming",
        minThousands: 500,
        maxThousands: 1000,
        sortOrder: 2,
      },
      {
        labelRu: "от 1000 тыс.",
        labelUz: "1000 mingdan",
        minThousands: 1000,
        maxThousands: null,
        sortOrder: 3,
      },
    ],
  });

  await prisma.productAttribute.deleteMany();
  await prisma.attributeOption.deleteMany();

  const options: { type: AttributeType; nameRu: string; nameUz: string }[] = [
    { type: "FILLING", nameRu: "Шоколад", nameUz: "Shokolad" },
    { type: "FILLING", nameRu: "Ваниль", nameUz: "Vanil" },
    { type: "FILLING", nameRu: "Карамель", nameUz: "Karamel" },
    { type: "FILLING", nameRu: "Чизкейк", nameUz: "Chizkeyk" },
    { type: "FRUIT", nameRu: "Клубника", nameUz: "Qulupnay" },
    { type: "FRUIT", nameRu: "Малина", nameUz: "Malina" },
    { type: "FRUIT", nameRu: "Вишня", nameUz: "Olcha" },
    { type: "FRUIT", nameRu: "Манго", nameUz: "Mango" },
    { type: "DOUGH", nameRu: "Бисквит", nameUz: "Biskvit" },
    { type: "DOUGH", nameRu: "Медовик", nameUz: "Asalli" },
    { type: "DOUGH", nameRu: "Шоколадный бисквит", nameUz: "Shokoladli biskvit" },
    { type: "DOUGH", nameRu: "Песочное", nameUz: "Qumli" },
  ];

  await prisma.attributeOption.createMany({
    data: options.map((o, i) => ({ ...o, sortOrder: i })),
  });

  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: products.collection.map((p, i) => ({
      categoryId: collection.id,
      nameRu: p.nameRu,
      nameUz: p.nameRu,
      size: "BIG",
      priceThousands: 150 + (i % 8) * 80,
      imageUrl: p.image,
      isPublished: i < 8,
      sortOrder: i,
    })),
  });

  await prisma.product.createMany({
    data: products.bento.map((p, i) => ({
      categoryId: bento.id,
      nameRu: p.nameRu,
      nameUz: p.nameRu,
      size: "BENTO",
      priceThousands: 120 + (i % 6) * 40,
      imageUrl: p.image,
      isPublished: i < 8,
      sortOrder: i,
    })),
  });

  const published = await prisma.product.findMany({
    where: { isPublished: true },
    select: { id: true },
  });
  const allOptions = await prisma.attributeOption.findMany();
  const byType = {
    FILLING: allOptions.filter((o) => o.type === "FILLING"),
    FRUIT: allOptions.filter((o) => o.type === "FRUIT"),
    DOUGH: allOptions.filter((o) => o.type === "DOUGH"),
  };

  for (let i = 0; i < published.length; i++) {
    const picks = [
      byType.FILLING[i % byType.FILLING.length]?.id,
      byType.FRUIT[i % byType.FRUIT.length]?.id,
      byType.DOUGH[i % byType.DOUGH.length]?.id,
    ].filter(Boolean) as string[];
    await prisma.productAttribute.createMany({
      data: picks.map((optionId) => ({
        productId: published[i].id,
        optionId,
      })),
      skipDuplicates: true,
    });
  }

  console.log(`Seed OK. Admin: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

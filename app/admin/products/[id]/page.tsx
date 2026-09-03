import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createProduct, deleteProduct, updateProduct } from "../../actions";

export default async function AdminProductFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const isNew = id === "new";

  const [categories, options, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.attributeOption.findMany({
      orderBy: [{ type: "asc" }, { sortOrder: "asc" }],
    }),
    isNew
      ? Promise.resolve(null)
      : prisma.product.findUnique({
          where: { id },
          include: { attributes: true },
        }),
  ]);

  if (!isNew && !product) notFound();

  const selected = new Set(product?.attributes.map((a) => a.optionId) ?? []);

  async function save(formData: FormData) {
    "use server";
    if (isNew) {
      await createProduct(formData);
      redirect("/admin/products");
    }
    formData.set("id", id);
    await updateProduct(formData);
    redirect(`/admin/products/${id}`);
  }

  return (
    <>
      <div className="admin-header">
        <h1>{isNew ? "Добавить товар" : `Изменить: ${product?.nameRu}`}</h1>
        <Link href="/admin/products" className="admin-btn admin-btn-secondary">
          ← К списку
        </Link>
      </div>

      <form action={save} className="admin-form" encType="multipart/form-data">
        {!isNew ? <input type="hidden" name="id" value={id} /> : null}

        <label>
          Название (RU)
          <input name="nameRu" required defaultValue={product?.nameRu ?? ""} />
        </label>
        <label>
          Название (UZ)
          <input name="nameUz" defaultValue={product?.nameUz ?? ""} />
        </label>
        <label>
          Размер
          <input name="size" defaultValue={product?.size ?? "BIG"} />
        </label>
        <label>
          Цена (тыс. сум)
          <input
            name="priceThousands"
            type="number"
            defaultValue={product?.priceThousands ?? ""}
          />
        </label>
        <label>
          Категория
          <select
            name="categoryId"
            required
            defaultValue={product?.categoryId ?? categories[0]?.id}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameRu}
              </option>
            ))}
          </select>
        </label>
        <label>
          Фото {isNew ? "" : "(оставьте пустым, чтобы не менять)"}
          <input name="image" type="file" accept="image/*" />
        </label>
        {!isNew && product ? (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt=""
              style={{ width: 120, height: 120, objectFit: "cover", border: "1px solid #ddd" }}
            />
          </div>
        ) : null}
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            name="isPublished"
            type="checkbox"
            defaultChecked={product?.isPublished ?? false}
          />
          Опубликован
        </label>

        <fieldset style={{ border: "1px solid #ddd", padding: "0.75rem" }}>
          <legend style={{ fontSize: "0.85rem", fontWeight: 700 }}>Атрибуты</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {options.map((o) => (
              <label
                key={o.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontWeight: 400,
                  background: "#f8f8f8",
                  padding: "0.25rem 0.5rem",
                  border: "1px solid #eee",
                }}
              >
                <input
                  type="checkbox"
                  name="optionIds"
                  value={o.id}
                  defaultChecked={selected.has(o.id)}
                />
                {o.type}: {o.nameRu}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn">
            Сохранить
          </button>
          {!isNew ? (
            <button formAction={deleteProduct} className="admin-btn admin-btn-danger">
              Удалить
            </button>
          ) : null}
        </div>
      </form>
    </>
  );
}

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteProduct } from "../actions";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  return (
    <>
      <div className="admin-header">
        <h1>Товары</h1>
        <Link href="/admin/products/new" className="admin-btn">
          Добавить товар
        </Link>
      </div>

      <p style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", color: "#666" }}>
        {products.length} товар(ов)
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Название</th>
              <th>Категория</th>
              <th>Размер</th>
              <th>Цена (тыс.)</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageUrl} alt="" className="admin-thumb" />
                </td>
                <td>
                  <Link href={`/admin/products/${p.id}`}>{p.nameRu}</Link>
                </td>
                <td>{p.category.nameRu}</td>
                <td>{p.size}</td>
                <td>{p.priceThousands ?? "—"}</td>
                <td>
                  <span
                    className={`admin-badge ${p.isPublished ? "admin-badge--yes" : "admin-badge--no"}`}
                  >
                    {p.isPublished ? "Опубликован" : "Скрыт"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    <Link href={`/admin/products/${p.id}`} className="admin-btn admin-btn-secondary">
                      Изменить
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="admin-btn admin-btn-danger">
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr>
                <td colSpan={7}>Нет товаров</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}

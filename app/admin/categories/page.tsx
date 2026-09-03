import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { upsertCategory } from "../actions";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <div className="admin-header">
        <h1>Категории</h1>
      </div>

      <div className="admin-module">
        <h2 className="admin-module__title">Добавить категорию</h2>
        <form action={upsertCategory} className="admin-form" style={{ border: "none", maxWidth: "none" }}>
          <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
            <label>
              Slug
              <input name="slug" required placeholder="collection" />
            </label>
            <label>
              Название RU
              <input name="nameRu" required />
            </label>
            <label>
              Название UZ
              <input name="nameUz" required />
            </label>
            <label>
              Описание RU
              <input name="descriptionRu" />
            </label>
            <label>
              Описание UZ
              <input name="descriptionUz" />
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn">
              Сохранить
            </button>
          </div>
        </form>
      </div>

      <p style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", color: "#666" }}>
        {categories.length} категорий
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Slug</th>
              <th>RU</th>
              <th>UZ</th>
              <th>Товаров</th>
              <th>Описание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td colSpan={6} style={{ padding: 0 }}>
                  <form
                    action={upsertCategory}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 80px 1.4fr auto",
                      gap: "0.4rem",
                      alignItems: "center",
                      padding: "0.45rem 0.7rem",
                    }}
                  >
                    <input type="hidden" name="id" value={c.id} />
                    <input name="slug" defaultValue={c.slug} />
                    <input name="nameRu" defaultValue={c.nameRu} />
                    <input name="nameUz" defaultValue={c.nameUz} />
                    <span>{c._count.products}</span>
                    <input name="descriptionRu" defaultValue={c.descriptionRu} title={c.descriptionUz} />
                    <input type="hidden" name="descriptionUz" defaultValue={c.descriptionUz} />
                    <button type="submit" className="admin-btn admin-btn-secondary">
                      Сохранить
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

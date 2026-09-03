import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { deleteAttribute, upsertAttribute } from "../actions";

const TYPE_LABEL: Record<string, string> = {
  FILLING: "Начинка",
  FRUIT: "Ягоды/фрукты",
  DOUGH: "Тип теста",
};

export default async function AdminAttributesPage() {
  await requireAdmin();
  const options = await prisma.attributeOption.findMany({
    orderBy: [{ type: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <>
      <div className="admin-header">
        <h1>Атрибуты</h1>
      </div>

      <div className="admin-module">
        <h2 className="admin-module__title">Добавить атрибут</h2>
        <form
          action={upsertAttribute}
          className="admin-form"
          style={{ border: "none", maxWidth: "none", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", display: "grid" }}
        >
          <label>
            Тип
            <select name="type">
              <option value="FILLING">Начинка</option>
              <option value="FRUIT">Ягоды/фрукты</option>
              <option value="DOUGH">Тип теста</option>
            </select>
          </label>
          <label>
            RU
            <input name="nameRu" required />
          </label>
          <label>
            UZ
            <input name="nameUz" required />
          </label>
          <div className="admin-form-actions" style={{ alignItems: "end" }}>
            <button type="submit" className="admin-btn">
              Добавить
            </button>
          </div>
        </form>
      </div>

      <p style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", color: "#666" }}>
        {options.length} атрибутов
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Тип</th>
              <th>Название RU</th>
              <th>Название UZ</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {options.map((o) => (
              <tr key={o.id}>
                <td colSpan={4} style={{ padding: 0 }}>
                  <form
                    action={upsertAttribute}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "160px 1fr 1fr auto auto",
                      gap: "0.4rem",
                      alignItems: "center",
                      padding: "0.45rem 0.7rem",
                    }}
                  >
                    <input type="hidden" name="id" value={o.id} />
                    <select name="type" defaultValue={o.type}>
                      <option value="FILLING">{TYPE_LABEL.FILLING}</option>
                      <option value="FRUIT">{TYPE_LABEL.FRUIT}</option>
                      <option value="DOUGH">{TYPE_LABEL.DOUGH}</option>
                    </select>
                    <input name="nameRu" defaultValue={o.nameRu} />
                    <input name="nameUz" defaultValue={o.nameUz} />
                    <button type="submit" className="admin-btn admin-btn-secondary">
                      Сохранить
                    </button>
                    <button formAction={deleteAttribute} className="admin-btn admin-btn-danger">
                      Удалить
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

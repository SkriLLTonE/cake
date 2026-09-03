import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { deleteBudget, upsertBudget } from "../actions";

export default async function AdminBudgetsPage() {
  await requireAdmin();
  const budgets = await prisma.budgetBucket.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <div className="admin-header">
        <h1>Бюджеты</h1>
      </div>

      <div className="admin-module">
        <h2 className="admin-module__title">Добавить корзину бюджета</h2>
        <form
          action={upsertBudget}
          className="admin-form"
          style={{ border: "none", maxWidth: "none" }}
        >
          <div
            style={{
              display: "grid",
              gap: "0.75rem",
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            }}
          >
            <label>
              Label RU
              <input name="labelRu" required />
            </label>
            <label>
              Label UZ
              <input name="labelUz" required />
            </label>
            <label>
              Min (тыс.)
              <input name="minThousands" type="number" required />
            </label>
            <label>
              Max (тыс., пусто = ∞)
              <input name="maxThousands" type="number" />
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn">
              Добавить
            </button>
          </div>
        </form>
      </div>

      <p style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", color: "#666" }}>
        {budgets.length} корзин
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Label RU</th>
              <th>Label UZ</th>
              <th>Min</th>
              <th>Max</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr key={b.id}>
                <td colSpan={5} style={{ padding: 0 }}>
                  <form
                    action={upsertBudget}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 90px 90px auto auto",
                      gap: "0.4rem",
                      alignItems: "center",
                      padding: "0.45rem 0.7rem",
                    }}
                  >
                    <input type="hidden" name="id" value={b.id} />
                    <input name="labelRu" defaultValue={b.labelRu} />
                    <input name="labelUz" defaultValue={b.labelUz} />
                    <input
                      name="minThousands"
                      type="number"
                      defaultValue={b.minThousands}
                    />
                    <input
                      name="maxThousands"
                      type="number"
                      defaultValue={b.maxThousands ?? ""}
                    />
                    <button type="submit" className="admin-btn admin-btn-secondary">
                      Сохранить
                    </button>
                    <button formAction={deleteBudget} className="admin-btn admin-btn-danger">
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

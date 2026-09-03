import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  await requireAdmin();
  const [products, published, categories, attributes, budgets] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isPublished: true } }),
      prisma.category.count(),
      prisma.attributeOption.count(),
      prisma.budgetBucket.count(),
    ]);

  return (
    <>
      <div className="admin-header">
        <h1>Дашборд</h1>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <p className="admin-stat__label">Товары</p>
          <p className="admin-stat__value">{products}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Опубликовано</p>
          <p className="admin-stat__value">{published}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Категории</p>
          <p className="admin-stat__value">{categories}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Атрибуты</p>
          <p className="admin-stat__value">{attributes}</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat__label">Бюджеты</p>
          <p className="admin-stat__value">{budgets}</p>
        </div>
      </div>

      <div className="admin-module" style={{ marginTop: "1rem" }}>
        <h2 className="admin-module__title">Быстрые ссылки</h2>
        <table className="admin-table">
          <tbody>
            <tr>
              <td>
                <Link href="/admin/products">Товары</Link>
              </td>
              <td>{products} записей</td>
            </tr>
            <tr>
              <td>
                <Link href="/admin/categories">Категории</Link>
              </td>
              <td>{categories} записей</td>
            </tr>
            <tr>
              <td>
                <Link href="/admin/attributes">Атрибуты</Link>
              </td>
              <td>{attributes} записей</td>
            </tr>
            <tr>
              <td>
                <Link href="/admin/budgets">Бюджеты</Link>
              </td>
              <td>{budgets} записей</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

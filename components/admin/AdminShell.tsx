"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/admin/sign-out";

const NAV = [
  {
    title: "Каталог",
    items: [
      { href: "/admin/products", label: "Товары" },
      { href: "/admin/categories", label: "Категории" },
    ],
  },
  {
    title: "Фильтры",
    items: [
      { href: "/admin/attributes", label: "Атрибуты" },
      { href: "/admin/budgets", label: "Бюджеты" },
    ],
  },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string | null;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Link href="/admin">Candy Cake Admin</Link>
        </div>
        <nav className="admin-sidebar__nav">
          <Link
            href="/admin"
            className={`admin-sidebar__link ${pathname === "/admin" ? "is-active" : ""}`}
          >
            Дашборд
          </Link>
          {NAV.map((group) => (
            <div key={group.title} className="admin-sidebar__group">
              <p className="admin-sidebar__group-title">{group.title}</p>
              {group.items.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-sidebar__link ${active ? "is-active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <Link href="/ru" className="admin-sidebar__link">
            ← На сайт
          </Link>
          <p className="admin-sidebar__email">{email}</p>
          <form action={signOutAction}>
            <button type="submit" className="admin-sidebar__logout">
              Выйти
            </button>
          </form>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span>Администрирование</span>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}

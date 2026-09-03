"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

export function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "ru" ? "uz" : "ru";

  return (
    <header className="sticky top-0 z-20 border-b border-beige-deep/80 bg-cream/95 backdrop-blur">
      <div className="container flex items-center justify-between gap-4 py-3">
        <Link href="/" className="font-[family-name:var(--font-display)] text-lg text-cherry md:text-xl">
          {t("brand")}
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-chocolate md:gap-5">
          <Link href="/about" className="hover:text-cherry">
            {t("nav.about")}
          </Link>
          <Link href="/catalog" className="hover:text-cherry">
            {t("nav.catalog")}
          </Link>
          <Link href="/contacts" className="hover:text-cherry">
            {t("nav.contacts")}
          </Link>
          <Link
            href={pathname}
            locale={other}
            className="rounded-full border border-cherry/40 bg-white px-2.5 py-0.5 uppercase tracking-wide text-cherry"
          >
            {other}
          </Link>
        </nav>
      </div>
    </header>
  );
}

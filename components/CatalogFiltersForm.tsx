"use client";

import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

type Opt = { id: string; nameRu: string; nameUz: string };
type Cat = { id: string; slug: string; nameRu: string; nameUz: string };
type Budget = {
  id: string;
  labelRu: string;
  labelUz: string;
};

export function CatalogFiltersForm({
  locale,
  categories,
  budgets,
  fillings,
  fruits,
  doughs,
  current,
}: {
  locale: string;
  categories: Cat[];
  budgets: Budget[];
  fillings: Opt[];
  fruits: Opt[];
  doughs: Opt[];
  current: {
    budget?: string;
    filling?: string;
    fruit?: string;
    dough?: string;
    category?: string;
  };
}) {
  const t = useTranslations("catalog");
  const router = useRouter();
  const label = (ru: string, uz: string) => (locale === "uz" ? uz : ru);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const key of ["category", "budget", "filling", "fruit", "dough"]) {
      const v = String(fd.get(key) ?? "");
      if (v) params.set(key, v);
    }
    const q = params.toString();
    router.push(q ? `/catalog?${q}` : "/catalog");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="h-fit space-y-4 rounded-2xl bg-beige/70 p-4 md:sticky md:top-20"
    >
      <h2 className="font-[family-name:var(--font-display)] text-lg text-cherry">
        {t("filters")}
      </h2>

      <Field label={t("all")} name="category" value={current.category}>
        <option value="">{t("all")}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {label(c.nameRu, c.nameUz)}
          </option>
        ))}
      </Field>

      <Field label={t("budget")} name="budget" value={current.budget}>
        <option value="">{t("all")}</option>
        {budgets.map((b) => (
          <option key={b.id} value={b.id}>
            {label(b.labelRu, b.labelUz)}
          </option>
        ))}
      </Field>

      <Field label={t("filling")} name="filling" value={current.filling}>
        <option value="">{t("all")}</option>
        {fillings.map((o) => (
          <option key={o.id} value={o.id}>
            {label(o.nameRu, o.nameUz)}
          </option>
        ))}
      </Field>

      <Field label={t("fruit")} name="fruit" value={current.fruit}>
        <option value="">{t("all")}</option>
        {fruits.map((o) => (
          <option key={o.id} value={o.id}>
            {label(o.nameRu, o.nameUz)}
          </option>
        ))}
      </Field>

      <Field label={t("dough")} name="dough" value={current.dough}>
        <option value="">{t("all")}</option>
        {doughs.map((o) => (
          <option key={o.id} value={o.id}>
            {label(o.nameRu, o.nameUz)}
          </option>
        ))}
      </Field>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button type="submit" className="btn-primary btn-filter w-full px-3 py-2 text-sm">
          {t("apply")}
        </button>
        <button
          type="button"
          onClick={() => router.push("/catalog")}
          className="btn-secondary btn-filter w-full px-3 py-2 text-sm"
        >
          {t("reset")}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  children,
}: {
  label: string;
  name: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-chocolate-soft">{label}</span>
      <select
        name={name}
        defaultValue={value ?? ""}
        className="w-full rounded-xl border border-beige-deep bg-white px-3 py-2 text-chocolate outline-none focus:border-cherry"
      >
        {children}
      </select>
    </label>
  );
}

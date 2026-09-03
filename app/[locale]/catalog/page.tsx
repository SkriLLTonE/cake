import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCatalogData } from "@/lib/catalog";
import { CatalogFiltersForm } from "@/components/CatalogFiltersForm";

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("catalog");

  const filters = {
    budget: sp.budget,
    filling: sp.filling,
    fruit: sp.fruit,
    dough: sp.dough,
    category: sp.category,
  };

  let data;
  try {
    data = await getCatalogData(filters);
  } catch {
    data = {
      categories: [],
      budgets: [],
      fillings: [],
      fruits: [],
      doughs: [],
      products: [],
    };
  }

  return (
    <section className="vintage-page relative overflow-hidden">
      <div className="vintage-paper" aria-hidden="true" />
      <div className="container py-8 md:py-12">
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-3xl text-cherry md:text-4xl">
        {t("title")}
      </h1>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <CatalogFiltersForm
          locale={locale}
          categories={data.categories}
          budgets={data.budgets}
          fillings={data.fillings}
          fruits={data.fruits}
          doughs={data.doughs}
          current={filters}
        />

        <div>
          {data.products.length === 0 ? (
            <p className="rounded-2xl bg-beige/60 p-6 text-chocolate-soft">{t("empty")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {data.products.map((product) => {
                const name = locale === "uz" ? product.nameUz : product.nameRu;
                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(74,44,26,0.08)]"
                  >
                    <div className="relative aspect-square bg-beige">
                      <Image
                        src={product.imageUrl}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="space-y-1 p-3">
                      <h2 className="line-clamp-2 text-sm font-semibold text-chocolate md:text-base">
                        {name}
                      </h2>
                      <p className="text-xs text-chocolate-soft">
                        {t("size")}: {product.size}
                      </p>
                      <p className="text-sm text-cherry">
                        {product.priceThousands != null
                          ? t("price", { value: product.priceThousands })
                          : t("priceAsk")}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}

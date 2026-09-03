import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { VintageCorner, VintageFlourish } from "@/components/VintageOrnaments";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <section className="vintage-page relative overflow-hidden">
      <div className="vintage-paper" aria-hidden="true" />
      <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10 max-w-xl">
          <VintageFlourish className="vintage-fade mb-4 w-44" />
          <p className="text-sm uppercase tracking-[0.22em] text-cherry">
            {t("brand")}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-chocolate md:text-6xl">
            {t("home.headline")}
          </h1>
          <p className="mt-4 max-w-md text-lg text-chocolate-soft">
            {t("home.sub")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/catalog" className="btn-primary text-sm">
              {t("home.ctaCatalog")}
            </Link>
            <Link href="/contacts" className="btn-secondary text-sm">
              {t("home.ctaContact")}
            </Link>
          </div>
          <p className="vintage-caption mt-8">est. atelier · handcrafted sweets</p>
        </div>

        <div className="vintage-stage vintage-float relative mx-auto w-full max-w-md lg:max-w-none">
          <VintageCorner className="pointer-events-none absolute -left-2 -top-2 z-20 w-16 md:w-20" />
          <VintageCorner className="pointer-events-none absolute -bottom-2 -right-2 z-20 w-16 rotate-180 md:w-20" />
          <div className="vintage-frame">
            <div
              className="vintage-photo"
              style={{ backgroundImage: "url(/img/beliytort.png)" }}
            />
            <div
              className="vintage-photo vintage-photo--offset"
              style={{ backgroundImage: "url(/img/beliybento.png)" }}
            />
          </div>
          <div className="vintage-seal" aria-hidden="true">
            since
            <br />
            sweets
          </div>
        </div>
      </div>
    </section>
  );
}

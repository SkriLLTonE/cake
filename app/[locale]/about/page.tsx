import { getTranslations, setRequestLocale } from "next-intl/server";
import { VintageFlourish } from "@/components/VintageOrnaments";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <section className="vintage-page relative overflow-hidden">
      <div className="vintage-paper" aria-hidden="true" />
      <div className="container py-10 md:py-16">
        <div className="mb-8 flex flex-col items-start gap-3">
          <VintageFlourish className="w-40" />
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-cherry md:text-4xl">
            {t("title")}
          </h1>
        </div>
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div className="vintage-frame vintage-frame--soft">
            <div
              className="min-h-72 bg-cover bg-center md:min-h-[420px]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #8b1e3f33, #4a2c1a22), url(/img/gfoto.jpg)",
              }}
            />
          </div>
          <div className="vintage-quote-card">
            <p className="text-base leading-relaxed text-chocolate-soft md:text-lg">
              {t("body")}
            </p>
            <VintageFlourish className="mt-6 w-32" tone="chocolate" />
          </div>
        </div>
      </div>
    </section>
  );
}

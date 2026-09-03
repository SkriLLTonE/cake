import { getTranslations, setRequestLocale } from "next-intl/server";
import { VintageCorner, VintageFlourish } from "@/components/VintageOrnaments";

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacts");

  const tg = process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "https://t.me/cand_cake_by_me";
  const ig =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://www.instagram.com/candy_cake_by_moxina/";
  const phone = process.env.NEXT_PUBLIC_PHONE ?? "+998917778685";
  const address =
    process.env.NEXT_PUBLIC_ADDRESS ?? "Tashkent, Chirchik, 3-mikrorayon";

  return (
    <section className="vintage-page relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="vintage-paper" aria-hidden="true" />
      <div className="container grid min-h-[calc(100vh-4rem)] gap-8 py-8 lg:grid-cols-2 lg:items-stretch lg:gap-10 lg:py-10">
        <div className="relative z-10 flex max-w-xl flex-col justify-center">
          <VintageFlourish className="mb-4 w-40" />
          <h1 className="mb-8 font-[family-name:var(--font-display)] text-3xl text-cherry md:text-4xl">
            {t("title")}
          </h1>
          <div className="flex flex-col gap-4">
            <a href={tg} target="_blank" rel="noreferrer" className="btn-primary-block">
              {t("writeTg")}
            </a>
            <a href={ig} target="_blank" rel="noreferrer" className="btn-outline-block">
              {t("writeIg")}
            </a>
            <div className="mt-4 space-y-2 text-chocolate-soft">
              <p>
                <span className="text-sm uppercase tracking-wide text-cherry">
                  {t("phone")}:{" "}
                </span>
                <a href={`tel:${phone}`}>{phone}</a>
              </p>
              <p>
                <span className="text-sm uppercase tracking-wide text-cherry">
                  {t("address")}:{" "}
                </span>
                {address}
              </p>
            </div>
          </div>
        </div>

        <aside className="relative flex w-full items-center justify-center py-4 lg:py-0">
          <div className="vintage-postcard relative w-full max-w-md">
            <VintageCorner className="absolute left-3 top-3 z-10 w-14" />
            <VintageCorner className="absolute bottom-3 right-3 z-10 w-14 rotate-180" />
            <div className="vintage-postcard__inner relative flex min-h-[260px] flex-col justify-center px-8 py-10">
              <p className="font-[family-name:var(--font-display)] text-2xl text-cherry md:text-3xl">
                candy_cake_by_moxina
              </p>
              <VintageFlourish className="my-4 w-36" tone="chocolate" />
              <p className="max-w-sm text-sm leading-relaxed text-chocolate-soft md:text-base">
                Письмо сладкому дню — напишите нам в Telegram или Instagram, и мы
                подберём торт под ваш праздник.
              </p>
              <div
                className="vintage-postcard__stamp"
                style={{ backgroundImage: "url(/img/rosoviybento.png)" }}
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/admin");
  const sp = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-3xl text-cherry">
        Вход в админку
      </h1>
      {sp.error ? (
        <p className="mb-4 rounded-xl bg-cherry/10 px-3 py-2 text-sm text-cherry">
          Неверный email или пароль
        </p>
      ) : null}
      <form
        action={async (formData) => {
          "use server";
          try {
            await signIn("credentials", {
              email: String(formData.get("email")),
              password: String(formData.get("password")),
              redirectTo: "/admin",
            });
          } catch (error) {
            if (error instanceof AuthError) {
              redirect("/admin/login?error=1");
            }
            throw error;
          }
        }}
        className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <label className="block space-y-1 text-sm">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-beige-deep px-3 py-2"
            defaultValue="admin@candy.cake"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Пароль</span>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-beige-deep px-3 py-2"
          />
        </label>
        <button type="submit" className="btn-primary w-full py-2.5">
          Войти
        </button>
      </form>
    </div>
  );
}

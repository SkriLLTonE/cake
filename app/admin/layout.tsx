import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AdminShell email={session?.user?.email}>
      {children}
    </AdminShell>
  );
}

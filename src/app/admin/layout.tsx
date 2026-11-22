import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin-login";
import { AdminShell } from "@/components/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return <AdminLogin />;
  }
  return <AdminShell authenticated>{children}</AdminShell>;
}

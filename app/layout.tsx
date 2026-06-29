export const dynamic = "force-dynamic";
import "./globals.css";
import { AppShell } from "@/components/ui/AppShell";

const NAV = [{ href: "/", label: "Inicio" }, { href: "/clase", label: "Clases" }, { href: "/membresia", label: "Membresías" }, { href: "/membresía", label: "Membresía" }, { href: "/pago", label: "Pagos" }, { href: "/plan", label: "Plan" }, { href: "/socio", label: "Socios" }];

export const metadata = { title: "GymPro — Gestión de Gimnasio", description: "Generado con ScrumDev AI" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppShell items={NAV} title="GymPro — Gestión de Gimnasio">{children}</AppShell>
      </body>
    </html>
  );
}

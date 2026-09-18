import type { Metadata } from "next";
import { Baloo_2, DM_Sans } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-baloo",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "scaffold-arc · Playground USDC | Simonethg",
  description:
    "Casos de uso USDC en Arc: sueldo o factura en un solo saldo, template de Ethereum vs pago completo, y gas en dólares con piso de 20 Gwei.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${baloo.variable} ${dmSans.variable}`}>
      <body
        style={
          {
            "--font-display": "var(--font-baloo), 'Baloo 2', sans-serif",
            "--font-body": "var(--font-dm), 'DM Sans', sans-serif",
          } as React.CSSProperties
        }
      >
        <a className="skip-link" href="#contenido-principal" data-testid="skip-to-content">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}

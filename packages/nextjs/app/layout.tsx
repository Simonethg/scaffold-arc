import type { Metadata } from "next";
import { Baloo_2, DM_Sans } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { SkipLink } from "./components/SkipLink";
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
  title: "scaffold-arc · Playground USDC",
  description:
    "USDC use cases on Arc: salary/invoice in one balance, Ethereum template vs full payment, gas in dollars with a 20 Gwei floor. Locales: en, es, pt-BR, zh, ar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${baloo.variable} ${dmSans.variable}`}>
      <body
        style={
          {
            "--font-display": "var(--font-baloo), 'Baloo 2', sans-serif",
            "--font-body": "var(--font-dm), 'DM Sans', sans-serif",
          } as React.CSSProperties
        }
      >
        <I18nProvider>
          <SkipLink />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}

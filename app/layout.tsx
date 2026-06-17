import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Backoffice E-Commerce",
  description: "Plateforme de gestion e-commerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
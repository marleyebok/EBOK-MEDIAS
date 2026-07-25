import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "EBOK Médias — l'annuaire des médias du basket francophone",
  description:
    "Presse, podcasts, joueurs, coachs, clubs et créateurs de contenu : l'annuaire qui donne de la visibilité à celles et ceux qui font vivre le basket francophone. Un outil de la galaxie EBOK Basketball.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_live_Y2xlcmsuZWJvay5mciQ"
      }
      signInFallbackRedirectUrl="/proposer"
      signUpFallbackRedirectUrl="/proposer"
    >
      <html lang="fr" className={`${anton.variable} ${inter.variable}`}>
        <body>
          {/* Barre commune de la galaxie EBOK (fichier identique dans toutes les apps) */}
          <script src="/ebok-galaxy.js" defer />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

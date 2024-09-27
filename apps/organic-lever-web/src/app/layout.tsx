import "./globals.css";
import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import { Inter } from "next/font/google";
import ClientProvider from "../components/ClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Organic Lever",
  description: "Team productivity tracking for startups",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-100`}>
        <Navigation />
        <ClientProvider>
          <main className="p-4">
            <div className="max-w-4xl mx-auto">{children}</div>
          </main>
        </ClientProvider>
      </body>
    </html>
  );
}

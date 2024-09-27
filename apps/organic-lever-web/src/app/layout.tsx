import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientProvider from "../components/ClientProvider";
import RootLayoutClient from "../components/RootLayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Organic Lever",
  description: "Welcome to the Organic Lever project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          <RootLayoutClient> {children} </RootLayoutClient>
        </ClientProvider>
      </body>
    </html>
  );
}

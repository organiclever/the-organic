import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ayokoding - Software Engineering Learning Resources",
  description: "Access blogs and books to master software engineering",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang?: string };
}) {
  const lang = params.lang || "en";

  return (
    <html lang={lang}>
      <body className={`${inter.className} bg-black text-green-400`}>
        <nav className="p-4">
          <ul className="flex space-x-4">
            <li>
              <Link href={`/${lang}`} className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/blogs`} className="hover:underline">
                Blogs
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/books`} className="hover:underline">
                Books
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/about`} className="hover:underline">
                About
              </Link>
            </li>
          </ul>
        </nav>
        {children}
        <footer className="p-4 mt-12 border-t border-green-400">
          <p>&copy; 2024 Ayokoding. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}

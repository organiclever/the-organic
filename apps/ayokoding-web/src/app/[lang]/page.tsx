import Link from "next/link";
import { Book, FileText } from "lucide-react";

type Lang = "en" | "id";

export default function Home({ params }: { params: { lang?: string } }) {
  const lang = (params.lang as Lang) || "en";
  const t = getTranslations(lang);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Ayokoding</h1>
        <p className="text-xl">{t.tagline}</p>
      </header>

      <main>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{t.availableContent}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center text-center p-6 border border-green-400">
              <FileText size={48} className="mb-4" />
              <h3 className="text-xl font-bold mb-2">{t.blogs}</h3>
              <p>{t.blogsDescription}</p>
              <Link href={`/${lang}/blogs`} className="mt-4 underline">
                {t.readBlogs}
              </Link>
            </div>
            <div className="flex flex-col items-center text-center p-6 border border-green-400">
              <Book size={48} className="mb-4" />
              <h3 className="text-xl font-bold mb-2">{t.books}</h3>
              <p>{t.booksDescription}</p>
              <Link href={`/${lang}/books`} className="mt-4 underline">
                {t.exploreBooks}
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t.aboutPlatform}</h2>
          <p className="mb-4">{t.platformDescription}</p>
          <Link
            href={`/${lang}/about`}
            className="inline-block px-6 py-3 border border-green-400 hover:bg-green-900 transition-colors"
          >
            {t.learnMore}
          </Link>
        </section>
      </main>
    </div>
  );
}

function getTranslations(lang: Lang) {
  const translations = {
    en: {
      tagline: "Software engineering learning resources",
      availableContent: "Available Content",
      blogs: "Blogs",
      blogsDescription: "Insightful blogs on software engineering and careers",
      readBlogs: "Read blogs",
      books: "Books",
      booksDescription: "Comprehensive books on various programming topics",
      exploreBooks: "Explore books",
      aboutPlatform: "About Ayokoding",
      platformDescription:
        "Ayokoding is an e-learning platform focused on software engineering practice and careers. Our content is designed to help you learn and grow as a developer.",
      learnMore: "Learn more about us",
    },
    id: {
      tagline: "Sumber belajar rekayasa perangkat lunak",
      availableContent: "Konten Tersedia",
      blogs: "Blog",
      blogsDescription:
        "Blog berwawasan tentang rekayasa perangkat lunak dan karir",
      readBlogs: "Baca blog",
      books: "Buku",
      booksDescription: "Buku komprehensif tentang berbagai topik pemrograman",
      exploreBooks: "Jelajahi buku",
      aboutPlatform: "Tentang Ayokoding",
      platformDescription:
        "Ayokoding adalah platform e-learning yang berfokus pada praktik dan karir rekayasa perangkat lunak. Konten kami dirancang untuk membantu Anda belajar dan berkembang sebagai pengembang.",
      learnMore: "Pelajari lebih lanjut tentang kami",
    },
  };
  return translations[lang];
}

import { hello } from "@libs/hello";

export default function Home() {
  const greeting = hello("AyoKoding");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-6">{greeting}</h1>
      </main>
    </div>
  );
}

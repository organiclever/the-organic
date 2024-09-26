import { hello } from "@libs/hello";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">{hello("Organic Lever")}</h1>
      <p className="text-xl mb-4">Welcome to the Organic Lever project!</p>
    </div>
  );
}

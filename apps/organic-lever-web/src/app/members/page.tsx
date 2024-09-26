import { hello } from "@libs/hello";

export default function MembersPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">{hello("Members")}</h1>
      <p className="text-xl">Welcome to the members page!</p>
    </div>
  );
}

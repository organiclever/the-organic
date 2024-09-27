import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-primary text-primary-foreground p-4 mb-6">
      <ul className="flex space-x-4 justify-center">
        <li>
          <Link href="/" className="hover:text-primary-foreground/80">
            Home
          </Link>
        </li>
        {/* Apply the same class to all other navigation links */}
      </ul>
    </nav>
  );
}

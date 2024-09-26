import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/members", label: "Members" },
];

export default function Sidebar() {
  return (
    <nav className="w-64 bg-gray-100 h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>
      <ul>
        {navItems.map((item) => (
          <li key={item.href} className="mb-2">
            <Link
              href={item.href}
              className="text-blue-500 hover:text-blue-700"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

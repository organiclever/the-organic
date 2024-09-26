import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-primary text-primary-foreground p-4 mb-6">
      <ul className="flex space-x-4 justify-center">
        <li>
          <Link href="/teams" className="hover:text-primary-foreground/80">
            Teams Overview
          </Link>
        </li>
        <li>
          <Link
            href="/teams/members"
            className="hover:text-primary-foreground/80"
          >
            Team Members
          </Link>
        </li>
        <li>
          <Link
            href="/teams/roles"
            className="hover:text-primary-foreground/80"
          >
            Team Roles
          </Link>
        </li>
        <li>
          <Link
            href="/teams/squads"
            className="hover:text-primary-foreground/80"
          >
            Squads
          </Link>
        </li>
      </ul>
    </nav>
  );
}

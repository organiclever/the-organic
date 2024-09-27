"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  HamburgerMenuIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";

type NavItem = {
  name: string;
  href: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Teams",
    href: "/teams",
    children: [
      { name: "Members", href: "/teams/members" },
      { name: "Roles", href: "/teams/roles" },
      { name: "Squads", href: "/teams/squads" },
    ],
  },
];

type NavigationProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
};

export default function Navigation({
  isSidebarOpen,
  toggleSidebar,
  isMobile,
}: NavigationProps) {
  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-md lg:hidden ${
          isSidebarOpen ? "hidden" : "block"
        }`}
        aria-label="Toggle navigation"
      >
        <HamburgerMenuIcon />
      </button>
      <nav
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-primary text-primary-foreground transition-transform duration-300 ease-in-out ${
          isSidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="flex justify-between items-center p-4 lg:pt-8">
            <h2 className="text-xl font-bold">Organic Lever</h2>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 bg-primary-foreground/10 text-primary-foreground rounded-md lg:hidden"
                aria-label="Close navigation"
              >
                <Cross1Icon />
              </button>
            )}
          </div>
          <ul className="space-y-2 p-4">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
                level={0}
              />
            ))}
          </ul>
        </div>
      </nav>
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}

type NavItemProps = {
  item: NavItem;
  toggleSidebar: () => void;
  isMobile: boolean;
  level: number;
};

function NavItem({ item, toggleSidebar, isMobile, level }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(level < 2);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleClick = () => {
    if (!item.children && isMobile) {
      toggleSidebar();
    }
  };

  return (
    <li>
      <div className="flex items-center">
        {item.children ? (
          <button
            onClick={toggleOpen}
            className="flex items-center hover:text-primary-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 rounded w-full"
            aria-expanded={isOpen}
          >
            {level >= 2 &&
              (isOpen ? (
                <ChevronDownIcon className="w-4 h-4 mr-1" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 mr-1" />
              ))}
            {item.name}
          </button>
        ) : (
          <Link
            href={item.href}
            className="hover:text-primary-foreground/80 w-full block"
            onClick={handleClick}
          >
            {item.name}
          </Link>
        )}
      </div>
      {item.children && (isOpen || level < 2) && (
        <ul className="ml-4 mt-2 space-y-2">
          {item.children.map((child) => (
            <NavItem
              key={child.href}
              item={child}
              toggleSidebar={toggleSidebar}
              isMobile={isMobile}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

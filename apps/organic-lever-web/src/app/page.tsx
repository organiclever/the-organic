"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import Navigation from "../components/Navigation";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Welcome to Organic Lever
          </h1>
          <div className="grid grid-cols-1 gap-6">
            <LinkCard
              href="/teams"
              title="Team Management"
              description="Manage your teams, members, roles, and squads"
              Icon={Users}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type LinkCardProps = {
  href: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

function LinkCard({ href, title, description, Icon }: LinkCardProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <div className="flex flex-col items-center text-center">
          <Icon className="w-12 h-12 mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
}

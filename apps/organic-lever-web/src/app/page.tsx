import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Settings, Database, BarChart2, Briefcase } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Organic Lever Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Users className="mr-2" />
              Team Management
            </CardTitle>
            <CardDescription>
              Manage your team structure and organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/teams" passHref>
              <Button className="w-full">Go to Team Management</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <BarChart2 className="mr-2" />
              Performance Tracking
            </CardTitle>
            <CardDescription>
              Monitor and analyze team performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Briefcase className="mr-2" />
              Project Management
            </CardTitle>
            <CardDescription>Oversee and manage team projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Settings className="mr-2" />
              Settings
            </CardTitle>
            <CardDescription>Configure application settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/settings/db" passHref>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Database Management
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full flex items-center justify-start"
                disabled
              >
                <Settings className="mr-2 h-4 w-4" />
                General Settings
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-start"
                disabled
              >
                <Users className="mr-2 h-4 w-4" />
                User Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

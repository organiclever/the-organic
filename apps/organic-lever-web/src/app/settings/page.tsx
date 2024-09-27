import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Settings, Database, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Database className="mr-2" />
              Data Storage
            </CardTitle>
            <CardDescription>Manage your data storage settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/settings/data-storage" passHref>
              <Button className="w-full">Data Storage Management</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Settings className="mr-2" />
              General
            </CardTitle>
            <CardDescription>
              Configure general application settings
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
              <User className="mr-2" />
              User Preferences
            </CardTitle>
            <CardDescription>Customize your user experience</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

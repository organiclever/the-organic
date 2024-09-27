import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DatabaseIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Database Management</CardTitle>
            <CardDescription>
              Backup and restore your SQLite database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/settings/db" passHref>
              <Button className="w-full">
                <DatabaseIcon className="mr-2 h-4 w-4" />
                Manage Database
              </Button>
            </Link>
          </CardContent>
        </Card>
        {/* Add more setting cards here as needed */}
      </div>
    </div>
  );
}

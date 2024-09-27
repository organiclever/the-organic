import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { UserCircle, Users, Boxes } from "lucide-react";

export default function TeamManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Team Structure Management</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/teams/management/members">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCircle className="mr-2" />
                Team Members
              </CardTitle>
              <CardDescription>Manage team member information</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Add, remove, or update team member details and roles.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/teams/management/roles">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2" />
                Team Roles
              </CardTitle>
              <CardDescription>Manage team role definitions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Define, edit, or remove roles within your team structure.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/teams/management/squads">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Boxes className="mr-2" />
                Team Squads
              </CardTitle>
              <CardDescription>Manage team squad organization</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Create, modify, or disband squads within your team.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

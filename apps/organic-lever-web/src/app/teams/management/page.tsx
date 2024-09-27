import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Users, UserCircle, Boxes } from "lucide-react";

export default function TeamsManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Teams Management</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/teams/management/members">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2" />
                Members
              </CardTitle>
              <CardDescription>Manage team members</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Add, remove, or update team member information.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/teams/management/squads">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Boxes className="mr-2" />
                Squads
              </CardTitle>
              <CardDescription>Manage team squads</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Create, edit, or delete squads within your teams.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/teams/management/roles">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCircle className="mr-2" />
                Roles
              </CardTitle>
              <CardDescription>Manage team roles</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Define and assign roles to team members.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

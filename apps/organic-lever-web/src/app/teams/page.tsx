import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCircle, Boxes } from "lucide-react";

export default function TeamsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Users className="mr-2" />
              Management
            </CardTitle>
            <CardDescription>
              Manage your team structure and organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/teams/management/members" passHref>
                <Button variant="outline" className="w-full justify-start">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Members
                </Button>
              </Link>
              <Link href="/teams/management/roles" passHref>
                <Button variant="outline" className="w-full justify-start">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Roles
                </Button>
              </Link>
              <Link href="/teams/management/squads" passHref>
                <Button variant="outline" className="w-full justify-start">
                  <Boxes className="mr-2 h-4 w-4" />
                  Squads
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Users className="mr-2" />
              Performance
            </CardTitle>
            <CardDescription>
              Track and analyze team performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Performance tracking features coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Users className="mr-2" />
              Projects
            </CardTitle>
            <CardDescription>Manage and oversee team projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Project management features coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

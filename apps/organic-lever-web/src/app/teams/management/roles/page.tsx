import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Users, Edit, Trash } from "lucide-react";

export default function TeamRolesPage() {
  const roles = [
    { id: 1, name: "Developer", description: "Writes and maintains code" },
    {
      id: 2,
      name: "Designer",
      description: "Creates user interfaces and experiences",
    },
    {
      id: 3,
      name: "Manager",
      description: "Oversees team operations and strategy",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Team Roles Management</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Users className="mr-2" />
            Team Roles
          </CardTitle>
          <CardDescription>
            Define and manage roles within your team structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="mb-4">Add New Team Role</Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

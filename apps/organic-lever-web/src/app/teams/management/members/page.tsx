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
import { UserCircle, Edit, Trash } from "lucide-react";

export default function TeamMembersPage() {
  const members = [
    { id: 1, name: "John Doe", role: "Developer", squad: "Frontend" },
    { id: 2, name: "Jane Smith", role: "Designer", squad: "UX" },
    { id: 3, name: "Mike Johnson", role: "Manager", squad: "Leadership" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Team Members Management</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <UserCircle className="mr-2" />
            Team Members
          </CardTitle>
          <CardDescription>
            Manage your team members' information and assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="mb-4">Add New Team Member</Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Squad</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.squad}</TableCell>
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

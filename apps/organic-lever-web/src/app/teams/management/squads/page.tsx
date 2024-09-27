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
import { Boxes, Edit, Trash } from "lucide-react";

export default function TeamSquadsPage() {
  const squads = [
    { id: 1, name: "Frontend", members: 5, lead: "John Doe" },
    { id: 2, name: "Backend", members: 4, lead: "Jane Smith" },
    { id: 3, name: "UX", members: 3, lead: "Mike Johnson" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Team Squads Management</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Boxes className="mr-2" />
            Team Squads
          </CardTitle>
          <CardDescription>
            Organize and manage squads within your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="mb-4">Create New Squad</Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Squad Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Squad Lead</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {squads.map((squad) => (
                <TableRow key={squad.id}>
                  <TableCell>{squad.name}</TableCell>
                  <TableCell>{squad.members}</TableCell>
                  <TableCell>{squad.lead}</TableCell>
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

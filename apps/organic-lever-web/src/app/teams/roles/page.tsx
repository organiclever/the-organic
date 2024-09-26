"use client";

import { useState } from "react";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import Navigation from "../../../components/Navigation";

type TeamRole = {
  id: number;
  name: string;
  description: string;
};

const initialTeamRoles: TeamRole[] = [
  {
    id: 1,
    name: "Backend Developer",
    description: "Develops server-side logic and integrates with databases",
  },
  {
    id: 2,
    name: "Frontend Developer",
    description: "Creates user interfaces and client-side functionality",
  },
  {
    id: 3,
    name: "Engineering Manager",
    description: "Oversees technical projects and manages engineering teams",
  },
  {
    id: 4,
    name: "QA Engineer",
    description:
      "Ensures software quality through testing and quality assurance processes",
  },
  {
    id: 5,
    name: "SEIT",
    description: "Manages software engineering tools and infrastructure",
  },
  {
    id: 6,
    name: "Tech Lead",
    description:
      "Provides technical leadership and guidance to development teams",
  },
  {
    id: 7,
    name: "Release Manager",
    description: "Coordinates and manages software releases and deployments",
  },
];

export default function TeamRolesPage() {
  const [teamRoles, setTeamRoles] = useState<TeamRole[]>(initialTeamRoles);
  const [editingRole, setEditingRole] = useState<TeamRole | null>(null);

  const addTeamRole = (role: Omit<TeamRole, "id">) => {
    const newRole = { ...role, id: Date.now() };
    setTeamRoles([...teamRoles, newRole]);
  };

  const updateTeamRole = (updatedRole: TeamRole) => {
    setTeamRoles(
      teamRoles.map((role) => (role.id === updatedRole.id ? updatedRole : role))
    );
    setEditingRole(null);
  };

  const deleteTeamRole = (id: number) => {
    setTeamRoles(teamRoles.filter((role) => role.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Team Roles Management
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingRole ? "Edit Team Role" : "Add New Team Role"}
            </h2>
            <TeamRoleForm
              onSubmit={editingRole ? updateTeamRole : addTeamRole}
              initialData={editingRole}
              onCancel={() => setEditingRole(null)}
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Team Roles List</h2>
            <div className="space-y-4">
              {teamRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
                >
                  <div>
                    <h3 className="font-semibold">{role.name}</h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingRole(role)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                      aria-label="Edit team role"
                    >
                      <Pencil1Icon />
                    </button>
                    <button
                      onClick={() => deleteTeamRole(role.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                      aria-label="Delete team role"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type TeamRoleFormProps = {
  onSubmit: (role: Omit<TeamRole, "id">) => void;
  initialData?: TeamRole | null;
  onCancel: () => void;
};

function TeamRoleForm({ onSubmit, initialData, onCancel }: TeamRoleFormProps) {
  const [formData, setFormData] = useState<Omit<TeamRole, "id">>(
    initialData || { name: "", description: "" }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", description: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Role Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div className="flex justify-end space-x-2">
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData ? "Update" : "Add"} Team Role
        </button>
      </div>
    </form>
  );
}

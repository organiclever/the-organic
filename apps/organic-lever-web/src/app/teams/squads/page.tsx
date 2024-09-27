"use client";

import { useState, useEffect } from "react";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

type Squad = {
  id: number;
  name: string;
  description: string;
};

const initialSquads: Squad[] = [
  {
    id: 1,
    name: "Core Banking",
    description: "Focuses on core banking functionalities and infrastructure",
  },
  {
    id: 2,
    name: "Release",
    description: "Manages the release process and deployment pipeline",
  },
  {
    id: 3,
    name: "Savings & Transaction",
    description: "Handles savings accounts and transaction processing",
  },
  {
    id: 4,
    name: "User Lifecycle",
    description:
      "Manages user onboarding, authentication, and account management",
  },
];

export default function SquadsPage() {
  const [squads, setSquads] = useState<Squad[]>(initialSquads);
  const [editingSquad, setEditingSquad] = useState<Squad | null>(null);
  const [formData, setFormData] = useState<Omit<Squad, "id">>({
    name: "",
    description: "",
  });

  const addSquad = (squad: Omit<Squad, "id">) => {
    const newSquad = { ...squad, id: Date.now() };
    setSquads([...squads, newSquad]);
  };

  const updateSquad = (updatedSquad: Squad) => {
    setSquads(
      squads.map((squad) =>
        squad.id === updatedSquad.id ? updatedSquad : squad
      )
    );
    setEditingSquad(null);
  };

  const deleteSquad = (id: number) => {
    setSquads(squads.filter((squad) => squad.id !== id));
  };

  const handleCancel = () => {
    setEditingSquad(null);
    setFormData({ name: "", description: "" });
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">Squad Management</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingSquad ? "Edit Squad" : "Add New Squad"}
        </h2>
        <SquadForm
          onSubmit={editingSquad ? updateSquad : addSquad}
          initialData={editingSquad}
          onCancel={handleCancel}
        />
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Squads List</h2>
        <div className="space-y-4">
          {squads.map((squad) => (
            <div
              key={squad.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
            >
              <div>
                <h3 className="font-semibold">{squad.name}</h3>
                <p className="text-sm text-gray-600">{squad.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingSquad(squad)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                  aria-label="Edit squad"
                >
                  <Pencil1Icon />
                </button>
                <button
                  onClick={() => deleteSquad(squad.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  aria-label="Delete squad"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

type SquadFormProps = {
  onSubmit: (squad: Omit<Squad, "id"> & { id?: number }) => void;
  initialData?: Squad | null;
  onCancel: () => void;
};

function SquadForm({ onSubmit, initialData, onCancel }: SquadFormProps) {
  const [formData, setFormData] = useState<Omit<Squad, "id">>(
    initialData || { name: "", description: "" }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: "", description: "" });
    }
  }, [initialData]);

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
          Squad Name *
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
          {initialData ? "Update" : "Add"} Squad
        </button>
      </div>
    </form>
  );
}

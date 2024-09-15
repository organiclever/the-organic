"use client";

import React, { useState, useEffect } from "react";
import { TeamMember } from "./types";

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
  });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    const response = await fetch("/api/team-members");
    const data = await response.json();
    setTeamMembers(data);
  };

  const addMember = async () => {
    const response = await fetch("/api/team-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember),
    });
    if (response.ok) {
      const addedMember = await response.json();
      setTeamMembers([...teamMembers, addedMember]);
      setNewMember({ name: "", role: "" });
    }
  };

  const updateMember = async () => {
    if (!editingMember) return;
    const response = await fetch("/api/team-members", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingMember),
    });
    if (response.ok) {
      const updatedMember = await response.json();
      setTeamMembers(
        teamMembers.map((m) => (m.id === updatedMember.id ? updatedMember : m))
      );
      setEditingMember(null);
    }
  };

  const deleteMember = async (id: number) => {
    const response = await fetch(`/api/team-members?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setTeamMembers(teamMembers.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Team Members</h1>

      {/* Add new member form */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newMember.name || ""}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Role"
          value={newMember.role || ""}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
          className="border p-2 mr-2"
        />
        <button
          onClick={addMember}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Member
        </button>
      </div>

      {/* Team members list */}
      <ul>
        {teamMembers.map((member) => (
          <li key={member.id} className="mb-2">
            {editingMember && editingMember.id === member.id ? (
              <>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, name: e.target.value })
                  }
                  className="border p-1 mr-2"
                />
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, role: e.target.value })
                  }
                  className="border p-1 mr-2"
                />
                <button
                  onClick={updateMember}
                  className="bg-green-500 text-white p-1 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingMember(null)}
                  className="bg-gray-500 text-white p-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {member.name} - {member.role}
                <button
                  onClick={() => setEditingMember(member)}
                  className="bg-yellow-500 text-white p-1 rounded ml-2 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMember(member.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

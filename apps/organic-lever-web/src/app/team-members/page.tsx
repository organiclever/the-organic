"use client";

import React, { useState, useEffect } from "react";
import { TeamMember } from "./types";
import { validateTeamMember } from "./validation";

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    githubId: "", // Add this line
  });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TeamMember, string>>
  >({});

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    const response = await fetch("/api/team-members");
    const data = await response.json();
    setTeamMembers(data);
  };

  const validateForm = (member: Partial<TeamMember>): boolean => {
    const validationErrors = validateTeamMember(member);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const addMember = async () => {
    if (!validateForm(newMember)) return;

    const response = await fetch("/api/team-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember),
    });
    if (response.ok) {
      const addedMember = await response.json();
      setTeamMembers([...teamMembers, addedMember]);
      setNewMember({ name: "", role: "", githubId: "" });
    } else {
      const errorData = await response.json();
      setErrors(errorData.errors || {});
    }
  };

  const updateMember = async () => {
    if (!editingMember || !validateForm(editingMember)) return;

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
    } else {
      const errorData = await response.json();
      setErrors(errorData.errors || {});
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
          className={`border p-2 mr-2 ${errors.name ? "border-red-500" : ""}`}
          required
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name}</span>
        )}
        <input
          type="text"
          placeholder="Role"
          value={newMember.role || ""}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
          className={`border p-2 mr-2 ${errors.role ? "border-red-500" : ""}`}
          required
        />
        {errors.role && (
          <span className="text-red-500 text-sm">{errors.role}</span>
        )}
        <input
          type="text"
          placeholder="GitHub ID"
          value={newMember.githubId || ""}
          onChange={(e) =>
            setNewMember({ ...newMember, githubId: e.target.value })
          }
          className={`border p-2 mr-2 ${
            errors.githubId ? "border-red-500" : ""
          }`}
          required
        />
        {errors.githubId && (
          <span className="text-red-500 text-sm">{errors.githubId}</span>
        )}
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
                  className={`border p-1 mr-2 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name}</span>
                )}
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, role: e.target.value })
                  }
                  className={`border p-1 mr-2 ${
                    errors.role ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.role && (
                  <span className="text-red-500 text-sm">{errors.role}</span>
                )}
                <input
                  type="text"
                  value={editingMember.githubId}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      githubId: e.target.value,
                    })
                  }
                  className={`border p-1 mr-2 ${
                    errors.githubId ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.githubId && (
                  <span className="text-red-500 text-sm">
                    {errors.githubId}
                  </span>
                )}
                {/* ... existing buttons ... */}
              </>
            ) : (
              <>
                {member.name} - {member.role} (GitHub: {member.githubId})
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

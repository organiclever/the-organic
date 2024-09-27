"use client";

import { useState, useEffect, useRef } from "react";
import {
  Pencil1Icon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

type TeamRole =
  | "Backend Developer"
  | "Frontend Developer"
  | "Engineering Manager"
  | "QA Engineer"
  | "SEIT"
  | "Tech Lead"
  | "Release Manager";
type Squad =
  | "Core Banking"
  | "Release"
  | "Savings & Transaction"
  | "User Lifecycle";

type Member = {
  id: number;
  name: string;
  githubId: string;
  jiraId?: string;
  slackId?: string;
  teamRole: TeamRole;
  squad: Squad;
};

const mockMembers: Member[] = [
  {
    id: 1,
    name: "Alice Johnson",
    githubId: "alice_dev",
    jiraId: "alice.j",
    slackId: "alice_slack",
    teamRole: "Backend Developer",
    squad: "Core Banking",
  },
  {
    id: 2,
    name: "Bob Smith",
    githubId: "bob_coder",
    jiraId: "bob.s",
    teamRole: "Frontend Developer",
    squad: "User Lifecycle",
  },
  {
    id: 3,
    name: "Charlie Brown",
    githubId: "charlie_git",
    slackId: "charlie_slack",
    teamRole: "QA Engineer",
    squad: "Savings & Transaction",
  },
  {
    id: 4,
    name: "Diana Prince",
    githubId: "wonder_coder",
    teamRole: "Tech Lead",
    squad: "Core Banking",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    githubId: "mission_dev",
    jiraId: "ethan.h",
    slackId: "ethan_slack",
    teamRole: "Engineering Manager",
    squad: "Release",
  },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [displayedMembers, setDisplayedMembers] = useState<Member[]>([]);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMembers(mockMembers);
    setDisplayedMembers(mockMembers.slice(0, 10));
  }, []);

  useEffect(() => {
    const filteredMembers = members.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedMembers(filteredMembers.slice(0, 10));
    setPage(1);
  }, [searchTerm, members]);

  const loadMore = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * 10;
    const end = start + 10;
    const filteredMembers = members.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedMembers([
      ...displayedMembers,
      ...filteredMembers.slice(start, end),
    ]);
    setPage(nextPage);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          displayedMembers.length < members.length
        ) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [displayedMembers, members, loadMore]);

  const addMember = (member: Omit<Member, "id">) => {
    const newMember = { ...member, id: Date.now() };
    setMembers([...members, newMember]);
    setDisplayedMembers([...displayedMembers, newMember]);
  };

  const updateMember = (updatedMember: Omit<Member, "id">) => {
    const updatedMembers = members.map((m) =>
      m.id === editingMember?.id ? { ...updatedMember, id: m.id } : m
    );
    setMembers(updatedMembers);
    setDisplayedMembers(updatedMembers.slice(0, displayedMembers.length));
    setEditingMember(null);
  };

  const deleteMember = (id: number) => {
    const updatedMembers = members.filter((m) => m.id !== id);
    setMembers(updatedMembers);
    setDisplayedMembers(updatedMembers.slice(0, displayedMembers.length));
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">Team Members</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingMember ? "Edit Member" : "Add New Member"}
        </h2>
        <MemberForm
          onSubmit={editingMember ? updateMember : addMember}
          initialData={editingMember}
          onCancel={() => setEditingMember(null)}
        />
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Member List</h2>
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="space-y-4">
          {displayedMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
            >
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">
                  GitHub: {member.githubId}
                </p>
                {member.jiraId && (
                  <p className="text-sm text-gray-600">Jira: {member.jiraId}</p>
                )}
                {member.slackId && (
                  <p className="text-sm text-gray-600">
                    Slack: {member.slackId}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Team Role: {member.teamRole}
                </p>
                <p className="text-sm text-gray-600">Squad: {member.squad}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingMember(member)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                  aria-label="Edit member"
                >
                  <Pencil1Icon />
                </button>
                <button
                  onClick={() => deleteMember(member.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  aria-label="Delete member"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div ref={loader} className="h-10" />
      </div>
    </>
  );
}

type MemberFormProps = {
  onSubmit: (member: Omit<Member, "id">) => void;
  initialData?: Member | null;
  onCancel: () => void;
};

function MemberForm({ onSubmit, initialData, onCancel }: MemberFormProps) {
  const [formData, setFormData] = useState<Omit<Member, "id">>(
    initialData || {
      name: "",
      githubId: "",
      jiraId: "",
      slackId: "",
      teamRole: "Backend Developer",
      squad: "Core Banking",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      githubId: "",
      jiraId: "",
      slackId: "",
      teamRole: "Backend Developer",
      squad: "Core Banking",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
          Name *
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
          htmlFor="githubId"
          className="block text-sm font-medium text-gray-700"
        >
          GitHub ID *
        </label>
        <input
          type="text"
          id="githubId"
          name="githubId"
          value={formData.githubId}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="jiraId"
          className="block text-sm font-medium text-gray-700"
        >
          Jira ID (optional)
        </label>
        <input
          type="text"
          id="jiraId"
          name="jiraId"
          value={formData.jiraId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="slackId"
          className="block text-sm font-medium text-gray-700"
        >
          Slack ID (optional)
        </label>
        <input
          type="text"
          id="slackId"
          name="slackId"
          value={formData.slackId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="teamRole"
          className="block text-sm font-medium text-gray-700"
        >
          Team Role *
        </label>
        <select
          id="teamRole"
          name="teamRole"
          value={formData.teamRole}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          <option value="Backend Developer">Backend Developer</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Engineering Manager">Engineering Manager</option>
          <option value="QA Engineer">QA Engineer</option>
          <option value="SEIT">SEIT</option>
          <option value="Tech Lead">Tech Lead</option>
          <option value="Release Manager">Release Manager</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="squad"
          className="block text-sm font-medium text-gray-700"
        >
          Squad *
        </label>
        <select
          id="squad"
          name="squad"
          value={formData.squad}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          <option value="Core Banking">Core Banking</option>
          <option value="Release">Release</option>
          <option value="Savings & Transaction">Savings & Transaction</option>
          <option value="User Lifecycle">User Lifecycle</option>
        </select>
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
          {initialData ? "Update" : "Add"} Member
        </button>
      </div>
    </form>
  );
}

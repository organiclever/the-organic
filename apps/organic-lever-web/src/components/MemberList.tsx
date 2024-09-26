"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface Member {
  id: string;
  name: string;
  github_account: string;
}

const fetchMembers = async (): Promise<Member[]> => {
  const response = await fetch("/api/members");
  if (!response.ok) {
    throw new Error("Failed to fetch members");
  }
  return response.json();
};

const deleteMember = async (id: string): Promise<void> => {
  const response = await fetch("/api/members", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error("Failed to delete member");
  }
};

export default function MemberList() {
  const queryClient = useQueryClient();

  const {
    data: members,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Members</h2>
      {members && members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">GitHub Account</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members?.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{member.name}</td>
                  <td className="py-2 px-4 border-b">
                    {member.github_account}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="space-x-2">
                      <Link
                        href={`/members/${member.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        View
                      </Link>
                      <Link
                        href={`/members/${member.id}/edit`}
                        className="text-green-500 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link
        href="/members/new"
        className="block mt-4 text-blue-500 hover:underline"
      >
        Add New Member
      </Link>
    </div>
  );
}

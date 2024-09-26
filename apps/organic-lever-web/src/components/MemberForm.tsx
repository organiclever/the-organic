"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  name: string;
  github_account: string;
}

interface MemberFormData {
  name: string;
  github_account: string;
}

interface MemberFormProps {
  initialData?: Member;
  onSuccess?: () => void;
}

const createMember = async (data: MemberFormData): Promise<void> => {
  const response = await fetch("/api/members", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create member");
  }
};

const updateMember = async (
  id: string,
  data: MemberFormData
): Promise<void> => {
  const response = await fetch(`/api/members/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update member");
  }
};

export default function MemberForm({
  initialData,
  onSuccess,
}: MemberFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [githubAccount, setGithubAccount] = useState(
    initialData?.github_account || ""
  );
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: initialData
      ? (data: MemberFormData) => updateMember(initialData.id, data)
      : createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      if (initialData) {
        queryClient.invalidateQueries({ queryKey: ["member", initialData.id] });
      }
      onSuccess?.();
      router.push("/members");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ name, github_account: githubAccount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label
          htmlFor="github_account"
          className="block text-sm font-medium text-gray-700"
        >
          GitHub Account
        </label>
        <input
          type="text"
          id="github_account"
          value={githubAccount}
          onChange={(e) => setGithubAccount(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {mutation.isPending
          ? "Saving..."
          : initialData
          ? "Update Member"
          : "Create Member"}
      </button>
      {mutation.isError && (
        <div className="text-red-600">
          Error: {(mutation.error as Error).message}
        </div>
      )}
    </form>
  );
}

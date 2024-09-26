"use client";

import { useParams } from "next/navigation";
import MemberForm from "@/components/MemberForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchMember = async (id: string) => {
  const response = await fetch(`/api/members/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch member");
  }
  return response.json();
};

export default function EditMemberPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: member,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["member", id],
    queryFn: () => fetchMember(id as string),
    staleTime: 0, // This ensures the data is always fetched
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Member</h1>
      {member && (
        <MemberForm
          initialData={member}
          onSuccess={() => {
            // Invalidate and refetch members list
            queryClient.invalidateQueries({ queryKey: ["members"] });
            // Invalidate and refetch this specific member
            queryClient.invalidateQueries({ queryKey: ["member", id] });
          }}
        />
      )}
    </div>
  );
}

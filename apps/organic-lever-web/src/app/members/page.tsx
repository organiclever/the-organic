"use client";

import MemberList from "@/components/MemberList";

export default function MembersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Members Page</h1>
      <MemberList />
    </div>
  );
}

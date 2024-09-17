import React from "react";
import { getTeamMembers, TeamMember } from "../../utils/teamMembersData";

export default async function TeamMembersPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={member.imageUrl}
        alt={member.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
        <p className="text-gray-600 mb-2">{member.role}</p>
        <p className="text-sm text-gray-500">{member.bio}</p>
      </div>
    </div>
  );
}

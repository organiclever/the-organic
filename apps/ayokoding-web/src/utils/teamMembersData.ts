export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

// This is a mock function. In a real application, you would fetch this data from an API or database.
export async function getTeamMembers(): Promise<TeamMember[]> {
  return [
    {
      id: "1",
      name: "John Doe",
      role: "Software Engineer",
      bio: "John is a passionate software engineer with 5 years of experience.",
      imageUrl: "https://example.com/john-doe.jpg",
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "UX Designer",
      bio: "Jane is a creative UX designer who loves to solve complex problems.",
      imageUrl: "https://example.com/jane-smith.jpg",
    },
    // Add more team members as needed
  ];
}

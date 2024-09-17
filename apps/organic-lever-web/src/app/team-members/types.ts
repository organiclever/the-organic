export interface TeamMember {
  id: number;
  name: string;
  role: string;
  githubId: string; // Add this line
  avatarUrl?: string; // Add this line
}

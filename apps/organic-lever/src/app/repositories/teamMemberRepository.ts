import fs from "fs/promises";
import path from "path";
import { TeamMember } from "../team-members/types";

const dataFilePath = path.join(
  process.cwd(),
  "..",
  "organic-lever",
  "team-members.json"
);

export class TeamMemberRepository {
  async getAll(): Promise<TeamMember[]> {
    try {
      const data = await fs.readFile(dataFilePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        await this.saveAll([]);
        return [];
      }
      throw error;
    }
  }

  async saveAll(teamMembers: TeamMember[]): Promise<void> {
    await fs.writeFile(dataFilePath, JSON.stringify(teamMembers, null, 2));
  }

  async add(newMember: Omit<TeamMember, "id">): Promise<TeamMember> {
    const teamMembers = await this.getAll();
    const newId = Math.max(0, ...teamMembers.map((m) => m.id)) + 1;
    const memberWithId = { ...newMember, id: newId } as TeamMember;
    teamMembers.push(memberWithId);
    await this.saveAll(teamMembers);
    return memberWithId;
  }

  async update(updatedMember: TeamMember): Promise<TeamMember | null> {
    const teamMembers = await this.getAll();
    const index = teamMembers.findIndex(
      (member) => member.id === updatedMember.id
    );
    if (index !== -1) {
      teamMembers[index] = { ...teamMembers[index], ...updatedMember };
      await this.saveAll(teamMembers);
      return teamMembers[index];
    }
    return null;
  }

  async delete(id: number): Promise<boolean> {
    const teamMembers = await this.getAll();
    const filteredMembers = teamMembers.filter((member) => member.id !== id);
    if (filteredMembers.length < teamMembers.length) {
      await this.saveAll(filteredMembers);
      return true;
    }
    return false;
  }
}

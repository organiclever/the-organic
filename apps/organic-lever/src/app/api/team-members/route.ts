import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { TeamMember } from "../../team-members/types";

// Adjust the path to point to the new location
const dataFilePath = path.join(
  process.cwd(),
  "..",
  "organic-lever",
  "team-members.json"
);

console.log("Current working directory:", process.cwd());
console.log("Data file path:", dataFilePath);

async function readTeamMembers(): Promise<TeamMember[]> {
  try {
    console.log("Attempting to read file:", dataFilePath);
    const data = await fs.readFile(dataFilePath, "utf-8");
    console.log("File contents:", data);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading team members:", error);
    // If the file doesn't exist, create it with an empty array
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeTeamMembers([]);
      return [];
    }
    throw error;
  }
}

async function writeTeamMembers(teamMembers: TeamMember[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(teamMembers, null, 2));
}

export async function GET() {
  try {
    const teamMembers = await readTeamMembers();
    console.log("Team members in GET:", teamMembers);
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const newMember = await request.json();
  const teamMembers = await readTeamMembers();
  const newId = Math.max(0, ...teamMembers.map((m) => m.id)) + 1;
  const memberWithId = { ...newMember, id: newId };
  teamMembers.push(memberWithId);
  await writeTeamMembers(teamMembers);
  return NextResponse.json(memberWithId, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { id, ...updatedMember } = await request.json();
  const teamMembers = await readTeamMembers();
  const index = teamMembers.findIndex((member) => member.id === id);
  if (index !== -1) {
    teamMembers[index] = { ...teamMembers[index], ...updatedMember };
    await writeTeamMembers(teamMembers);
    return NextResponse.json(teamMembers[index]);
  }
  return NextResponse.json({ error: "Member not found" }, { status: 404 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const teamMembers = await readTeamMembers();
  const filteredMembers = teamMembers.filter(
    (member) => member.id !== parseInt(id)
  );
  if (filteredMembers.length < teamMembers.length) {
    await writeTeamMembers(filteredMembers);
    return NextResponse.json({ message: "Member deleted successfully" });
  }
  return NextResponse.json({ error: "Member not found" }, { status: 404 });
}

async function getTeamMembers() {
  return readTeamMembers();
}

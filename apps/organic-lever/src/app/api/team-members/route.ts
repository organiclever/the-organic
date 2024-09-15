import { NextRequest, NextResponse } from "next/server";
import { TeamMember } from "../../team-members/types";
import { validateTeamMember } from "../../team-members/validation";
import { TeamMemberRepository } from "../../repositories/teamMemberRepository";

const repository = new TeamMemberRepository();

export async function GET() {
  try {
    const teamMembers = await repository.getAll();
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
  const newMember: Omit<TeamMember, "id"> = await request.json();
  const errors = validateTeamMember(newMember);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const addedMember = await repository.add(newMember);
    return NextResponse.json(addedMember, { status: 201 });
  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json(
      { error: "Failed to add team member" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const updatedMember: TeamMember = await request.json();
  const errors = validateTeamMember(updatedMember);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const result = await repository.update(updatedMember);
    if (result) {
      return NextResponse.json(result);
    }
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const deleted = await repository.delete(parseInt(id));
    if (deleted) {
      return NextResponse.json({ message: "Member deleted successfully" });
    }
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}

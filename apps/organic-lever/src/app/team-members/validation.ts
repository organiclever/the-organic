import { TeamMember } from "./types";

export function validateTeamMember(
  member: Partial<TeamMember>
): Partial<Record<keyof TeamMember, string>> {
  const errors: Partial<Record<keyof TeamMember, string>> = {};

  if (!member.name || member.name.trim() === "") {
    errors.name = "Name is required";
  }

  if (!member.role || member.role.trim() === "") {
    errors.role = "Role is required";
  }

  if (!member.githubId || member.githubId.trim() === "") {
    errors.githubId = "GitHub ID is required";
  } else if (
    !/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(member.githubId)
  ) {
    errors.githubId = "Invalid GitHub ID format";
  }

  return errors;
}

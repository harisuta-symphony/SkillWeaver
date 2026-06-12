export interface RequiredSkill {
  skillId: number;
  skillName: string;
  minimumProficiency: string;
}

export interface ProjectProposal {
  id: number;
  title: string;
  description?: string;
  requiredCommitmentPercentage: number;
  createdAt: string;
  requiredSkills: RequiredSkill[];
}

export interface CreateProjectProposal {
  title: string;
  description?: string;
  requiredCommitmentPercentage: number;
  requiredSkills: { skillId: number; minimumProficiency: string }[];
}

export interface TeamMember {
  employeeId: number;
  fullName: string;
  email: string;
  department?: string;
  availableCapacity: number;
  matchedSkills: { skillId: number; skillName: string; proficiencyLevel: string }[];
}

export interface SuggestedTeam {
  projectProposalId: number;
  projectTitle: string;
  suggestedMembers: TeamMember[];
  totalCandidates: number;
}
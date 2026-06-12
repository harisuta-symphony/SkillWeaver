import { Skill } from './skill.model';

export interface EmployeeSkill {
  skillId: number;
  skillName: string;
  proficiencyLevel: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  capacityPercentage: number;
  availableCapacity: number;
  skills: EmployeeSkill[];
}

export interface CreateEmployee {
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  capacityPercentage: number;
}
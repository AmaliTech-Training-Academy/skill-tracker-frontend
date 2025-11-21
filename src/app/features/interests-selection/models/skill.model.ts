import { ApiResponse, SkillLevel } from '@app/core';

export interface Skill {
  id: string;
  name: string;
  iconUrl: string;
  description: string;
  category: string;
  supportedTaskTypes: string[];
  levelXpMap: Map<SkillLevel, number>;
}

export type SkillCategory = 'PROGRAMMING' | 'DESIGN' | 'MANAGEMENT' | string;
export type TaskType = 'CODING' | 'ESSAY' | 'TESTING' | string;

export type SkillsResponse = ApiResponse<Skill[]>;

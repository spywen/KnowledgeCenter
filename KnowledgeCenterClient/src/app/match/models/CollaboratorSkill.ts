import {Skill} from './Skill';
import {SkillLevel} from './SkillLevel';

export interface CollaboratorSkill {
  id: number;
  skillId: number;
  skill: Skill;
  skillLevelId: number;
  skillLevel: SkillLevel;
}

import {Skill} from './Skill';
import {SkillLevel} from './SkillLevel';

export interface CustomerOfferSkill {
  id: number;
  skillId: number;
  skill: Skill;
  skillLevelId: number;
  skillLevel: SkillLevel;
  skillPriority: number;
  creationDate: Date;
  modificationDate: Date;
}

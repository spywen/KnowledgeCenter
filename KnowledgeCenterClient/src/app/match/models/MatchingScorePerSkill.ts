import { SkillLevel } from './SkillLevel';
import { CustomerOfferSkill } from './CustomerOfferSkill';

export interface MatchingScorePerSkill {
  id: number;
  skillLevelId: number;
  skillLevel: SkillLevel;
  customerOfferSkillId: number;
  customerOfferSkill: CustomerOfferSkill;
  score: number;
}

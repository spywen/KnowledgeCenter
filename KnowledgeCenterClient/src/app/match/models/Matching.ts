import { CustomerOffer } from './CustomerOffer';
import { Collaborator } from './Collaborator';
import { MatchingScorePerSkill } from './MatchingScorePerSkill';

export interface Matching {
  id: number;
  customerOffer: CustomerOffer;
  collaborator: Collaborator;
  creationDate: Date;
  score: number;
  matchingScorePerSkills: MatchingScorePerSkill[];
}

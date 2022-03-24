import { ServiceLine } from '../../shared/models/ServiceLine';

export interface Skill {
  id: number;
  name: string;
  serviceLineId: number;
  serviceLine?: ServiceLine;
}

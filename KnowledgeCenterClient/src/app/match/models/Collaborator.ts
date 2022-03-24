import { Agency } from '../../shared/models/Agency';
import { ServiceLine } from '../../shared/models/ServiceLine';
import { CollaboratorSkill } from './CollaboratorSkill';

export interface Collaborator {
  id: number;
  ggid: number;
  firstname: string;
  lastname: string;
  email: string;
  fullname: string;
  agencyId: number;
  agency: Agency;
  serviceLineId: number;
  serviceLine: ServiceLine;
  collaboratorSkills: CollaboratorSkill[];
}

export interface CreateOrUpdateCollaborator {
  id: number;
  ggid: number;
  firstname: string;
  lastname: string;
  email: string;
  agencyId: number;
  serviceLineId?: number;
}

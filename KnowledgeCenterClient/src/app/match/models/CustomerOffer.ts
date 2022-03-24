import { CustomerOfferStatus } from './CustomerOfferStatus';
import { User } from '../../shared/models/User';
import { CustomerSite } from './CustomerSite';
import { CustomerOfferSkill } from './CustomerOfferSkill';

export interface CustomerOffer {
  id: number;
  jobTitle: string;
  requester: string;
  creationDate: Date;
  missionStartDate: Date;
  missionEndDate: Date;
  mobilityRequired: boolean;
  onSite: boolean;
  workFromHome: boolean;
  customerOfferStatusId: number;
  customerOfferStatus: CustomerOfferStatus;
  description: string;
  customerAccountManagerId: number;
  customerAccountManager: User;
  customerSiteId: number;
  customerSite: CustomerSite;
  customerOfferSkills: CustomerOfferSkill[];
}

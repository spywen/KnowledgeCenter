import { User } from 'src/app/shared/models/User';
import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';

export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  creationDate: Date;
  modificationDate: Date;
  likeCount: number;
  likeAverageRate: number;
  user: User;
  status: SimpleEnum;
  tags: Array<SimpleEnum>;
  myLike: ProjectLike;
  approverFullName: string;
}

export interface ProjectLike {
  id: number;
  rate: number;
  dateCreation: Date;
}

export interface ProjectFilters {
  isOnlyMine: boolean;
  keyword: string;
  statusCodes: Array<ProjectStatus>;
  orderByDescendingCreationDate: boolean;
}

export enum ProjectStatus {
  WAITING = 'WAITING',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
  INPROGRESS = 'INPROGRESS',
  FINISHED = 'FINISHED'
}

export enum ProjectType {
  MY,
  PROJECTS,
  ADMIN,
  INPROGRESS,
  FINISHED
}
export interface ProjectTags {
  id: number;
  projectId: number;
  tagId: number;
}


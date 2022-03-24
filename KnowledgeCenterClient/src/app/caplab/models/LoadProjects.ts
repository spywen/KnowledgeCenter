import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';
import { BasePaginationResponse } from 'src/app/shared/models/BasePagination';
import { Project } from './Project';

export interface LoadProjectsObjectResolver {
  tags: SimpleEnum[];
  projectStatuses: SimpleEnum[];
  projectsResponse: BasePaginationResponse<Project[]>;
}

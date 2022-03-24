import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';
import { Publication } from './Publication';

export interface LoadPublicationsObjectResolver {
  publicationTypes: SimpleEnum[];
  publications: Publication[];
}

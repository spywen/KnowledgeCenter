import { User } from 'src/app/shared/models/User';
import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';

export interface Publication {
    id: number;
    message: string;
    creationDate: Date;
    modificationDate: Date;
    publicationDate: Date;
    isPublished: boolean;
    publicationTypeId: number;
    publicationType: SimpleEnum;
    user: User;
}

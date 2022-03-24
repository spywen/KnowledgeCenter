import { User } from 'src/app/shared/models/User';

export interface IPublication {
  id: number;
  categoryCode: string;
  message: string;
  creationDate: Date;
  isAnonymous: boolean;
  isOwner: boolean;
  user: User;
  likes: any[];
  userLike: string;
}

export enum PublicationLikeType {
  heart = 'heart',
  up = 'up',
  down = 'down',
  warning = 'warning'
}

export enum PublicationCategoryCode {
  GREEN = 'GREEN',
  TRANSPORT = 'TRANSPORT',
  DEV = 'DEV',
  FOOD = 'FOOD',
  GOODMOOD = 'GOODMOOD',
  BADMOOD = 'BADMOOD',
  WARNING = 'WARNING',
  EVENT = 'EVENT',
  OTHER = 'OTHER'
}

export const CategoryMetadata = {
  OTHER: { code: PublicationCategoryCode.OTHER, description: 'Other',  color: '#0277bd', icon: 'textsms' } as Category,
  GREEN: { code: PublicationCategoryCode.GREEN, description: 'Green', color: '#388e3c', icon: 'emoji_nature' } as Category,
  TRANSPORT: { code: PublicationCategoryCode.TRANSPORT, description: 'Transport', color: '#4e342e', icon: 'directions_car'} as Category,
  DEV: { code: PublicationCategoryCode.DEV, description: 'Dev', color: '#c2185b', icon: 'code' } as Category,
  FOOD: { code: PublicationCategoryCode.FOOD, description: 'Food', color: '#d50000', icon: 'fastfood' } as Category,
  GOODMOOD: { code: PublicationCategoryCode.GOODMOOD, description: 'Goodmood', color: '#fbc02d', icon: 'tag_faces'} as Category,
  BADMOOD: { code: PublicationCategoryCode.BADMOOD, description: 'Badmood', color: '#283593', icon: 'mood_bad' } as Category,
  WARNING: { code: PublicationCategoryCode.WARNING, description: 'Warning', color: '#757575', icon: 'warning' } as Category,
  EVENT: { code: PublicationCategoryCode.EVENT, description: 'Event', color: '#6a1b9a', icon: 'event_available'} as Category
};

export enum PublicationEvent {
  CREATED = 'CREATED',
  DELETED = 'DELETED',
  LIKED = 'LIKED'
}

export interface Category {
  code: string;
  description: string;
  color: string;
  icon: string;
}

export interface Like {
  count: number;
  isZeroCount: boolean;
  isUserLike: boolean;
}

export class Publication implements Publication {
  id: number;
  message: string;
  creationDate: Date;
  isAnonymous: boolean;
  isOwner: boolean;
  user: User;

  fontSize: number;
  likeLoading: boolean;
  category: Category;
  heartLikes: Like;
  upLikes: Like;
  downLikes: Like;
  warningLikes: Like;
  constructor(publication: IPublication) {
    this.id = publication.id;

    this.message = publication.message;
    this.creationDate = publication.creationDate;
    this.isAnonymous = publication.isAnonymous;
    this.isOwner = publication.isOwner;
    this.user = publication.user;

    this.category = CategoryMetadata[publication.categoryCode];
    this.likeLoading = false;
    this.setLikes(publication);
    this.refreshFontSize();
  }

  public setUserLike(newLikeCode: string): string {
    let initialLike: Like;
    if (this.heartLikes.isUserLike) {
      initialLike = this.heartLikes;
    } else if (this.upLikes.isUserLike) {
      initialLike = this.upLikes;
    } else if (this.downLikes.isUserLike) {
      initialLike = this.downLikes;
    } else if (this.warningLikes.isUserLike) {
      initialLike = this.warningLikes;
    }

    let finalLike: Like;
    if (newLikeCode === PublicationLikeType.heart) {
      finalLike = this.heartLikes;
    } else if (newLikeCode === PublicationLikeType.up) {
      finalLike = this.upLikes;
    } else if (newLikeCode === PublicationLikeType.down) {
      finalLike = this.downLikes;
    } else if (newLikeCode === PublicationLikeType.warning) {
      finalLike = this.warningLikes;
    }

    if (initialLike === finalLike) {
      initialLike.count -= 1;
      initialLike.isUserLike = false;
      initialLike.isZeroCount = (initialLike.count === 0);
    } else {
      if (initialLike) {
        initialLike.count -= 1;
        initialLike.isUserLike = false;
        initialLike.isZeroCount = (initialLike.count === 0);
      }
      finalLike.count += 1;
      finalLike.isUserLike = true;
      finalLike.isZeroCount = false;
    }

    return undefined;
  }

  private setLikes(publication: IPublication) {
    this.heartLikes = {
      count: !publication.likes[PublicationLikeType.heart] ? 0 : publication.likes[PublicationLikeType.heart],
      isZeroCount: !publication.likes[PublicationLikeType.heart] ? true : (publication.likes[PublicationLikeType.heart] === 0),
      isUserLike: publication.userLike === PublicationLikeType.heart
    };
    this.upLikes = {
      count: !publication.likes[PublicationLikeType.up] ? 0 : publication.likes[PublicationLikeType.up],
      isZeroCount: !publication.likes[PublicationLikeType.up] ? true : (publication.likes[PublicationLikeType.up] === 0),
      isUserLike: publication.userLike === PublicationLikeType.up
    };
    this.downLikes = {
      count: !publication.likes[PublicationLikeType.down] ? 0 : publication.likes[PublicationLikeType.down],
      isZeroCount: !publication.likes[PublicationLikeType.down] ? true : (publication.likes[PublicationLikeType.down] === 0),
      isUserLike: publication.userLike === PublicationLikeType.down
    };
    this.warningLikes = {
      count: !publication.likes[PublicationLikeType.warning] ? 0 : publication.likes[PublicationLikeType.warning],
      isZeroCount: !publication.likes[PublicationLikeType.warning] ? true : (publication.likes[PublicationLikeType.warning] === 0),
      isUserLike: publication.userLike === PublicationLikeType.warning
    };
  }

  public setLiveLikes(publication: IPublication) {
    this.heartLikes = {
      count: !publication.likes[PublicationLikeType.heart] ? 0 : publication.likes[PublicationLikeType.heart],
      isZeroCount: !publication.likes[PublicationLikeType.heart] ? true : (publication.likes[PublicationLikeType.heart] === 0),
      isUserLike: this.heartLikes.isUserLike
    };
    this.upLikes = {
      count: !publication.likes[PublicationLikeType.up] ? 0 : publication.likes[PublicationLikeType.up],
      isZeroCount: !publication.likes[PublicationLikeType.up] ? true : (publication.likes[PublicationLikeType.up] === 0),
      isUserLike: this.upLikes.isUserLike
    };
    this.downLikes = {
      count: !publication.likes[PublicationLikeType.down] ? 0 : publication.likes[PublicationLikeType.down],
      isZeroCount: !publication.likes[PublicationLikeType.down] ? true : (publication.likes[PublicationLikeType.down] === 0),
      isUserLike: this.downLikes.isUserLike
    };
    this.warningLikes = {
      count: !publication.likes[PublicationLikeType.warning] ? 0 : publication.likes[PublicationLikeType.warning],
      isZeroCount: !publication.likes[PublicationLikeType.warning] ? true : (publication.likes[PublicationLikeType.warning] === 0),
      isUserLike: this.warningLikes.isUserLike
    };
  }

  public refreshFontSize() {
    let balance = (2 * this.heartLikes.count)
      + this.upLikes.count
      - this.downLikes.count
      - (2 * this.warningLikes.count) + 16;
    if (balance < 10) {
      balance = 10;
    } else if (balance > 40) {
      balance = 40;
    }
    this.fontSize = balance;
  }
}

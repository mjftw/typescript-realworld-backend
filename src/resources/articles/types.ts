import { Tag } from '../tags/types';
import { UserProfile } from '../users/types';

export interface Article {
    id: number;
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: [Tag];
    createdAt: Date;
    updatedAt: Date;
    favorited: boolean;
    favoritesCount: number;
    author: UserProfile;
}

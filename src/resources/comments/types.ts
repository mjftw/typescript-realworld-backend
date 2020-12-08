import { UserProfile } from '../users/types';

export interface Comment {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    body: string;
    author: UserProfile;
}

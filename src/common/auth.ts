import { createHmac, randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { JwtAuth, User, UserAuth, UserLogin } from './types';
import { getUserByEmail } from '../db/queries';
import { jwtSecret } from '../config';

export async function loginUser(userLogin: UserLogin): Promise<User | null> {
    //TODO: 1. Check if user already logged in, error if so

    const user = await getUserByEmail(userLogin.email);

    if (user === null) {
        // No user found with email
        return null;
    }

    const hashedPassword = hashPassword(userLogin.password, user.password_salt);
    if (hashedPassword !== user.password_hash) {
        //Incorrect Password
        return null;
    }

    return user;
}

//TODO: Add expiry date to tokens
export function newAuthJwt(id: number, secret: string): string {
    const payload: JwtAuth = {
        uid: id,
    };

    return jwt.sign(payload, secret);
}

export function createUserAuth(user: User): UserAuth {
    const token = newAuthJwt(user.id, jwtSecret);

    const auth: UserAuth = {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token: token,
    };

    return auth;
}

export function hashPassword(password: string, salt: string): string {
    return createHmac('sha512', password).update(salt).digest('hex');
}

export function newSalt(length: number): string {
    return randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

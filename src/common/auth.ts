import { createHmac, randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { UserAuth, User, JwtAuth } from './types';
import { getUserByEmail } from '../db/queries';
import { jtwHmacAlgorithm, jwtSecret } from '../config';

//TODO: Better error handling than just returning null (throughout codebase!)
export async function loginUser(
    email: string,
    password: string
): Promise<User | null> {
    const user = await getUserByEmail(email);

    if (user === null) {
        // No user found with email
        return null;
    }

    const hashedPassword = hashPassword(password, user.password_salt);
    if (hashedPassword !== user.password_hash) {
        //Incorrect Password
        return null;
    }

    return user;
}

//TODO: Add expiry date to tokens
export function newAuthJwt(id: number, secret: string): string {
    const payload: JwtAuth = {
        userId: id,
    };
    return jwt.sign(payload, secret, { algorithm: jtwHmacAlgorithm });
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

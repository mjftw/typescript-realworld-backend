import { Request, Response } from 'express';
import { ErrResponseBody, HttpErrorCode } from '../common/types';

export function getJwtFromRequest(request: Request): string | undefined {
    const auth = request.headers.authorization;

    if (!auth) {
        console.log('Missing auth header');
        return undefined;
    }

    const auth_split = auth.split(' ');
    if (auth_split.length != 2 || auth_split[0] != 'Token') {
        console.log(`Incorrect auth token format: ${auth}`);
        return undefined;
    }

    return auth_split[1];
}

export function sendErrResponse(
    res: Response,
    code: HttpErrorCode,
    detail: unknown
): void {
    res.status(code).send(errResponse(detail));
}

// Format to be used when creating error responses
function errResponse(detail: unknown): ErrResponseBody {
    return { errors: detail };
}

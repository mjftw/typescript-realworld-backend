import { Request, Response } from 'express';
import { ErrResponseBody, HttpErrorCode } from '../common/types';
import { logResponseErrors } from '../config';

export function getJwtFromRequest(request: Request): string | undefined {
    const auth = request.headers.authorization;

    if (!auth) {
        return undefined;
    }

    const auth_split = auth.split(' ');
    if (auth_split.length != 2 || auth_split[0] != 'Token') {
        return undefined;
    }

    return auth_split[1];
}

// Send an error response in standard format.
// If the configuration 'logResponseErrors' is true, also log the error to the console
export function sendErrResponse(
    res: Response,
    code: HttpErrorCode,
    detail: unknown
): void {
    if (logResponseErrors) {
        console.error(`Error ${code}: ${JSON.stringify(detail, undefined, 2)}`);
    }
    res.status(code).send(errResponse(detail));
}

// Format to be used when creating error responses
function errResponse(detail: unknown): ErrResponseBody {
    return { errors: detail };
}

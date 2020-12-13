import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import { sendErrResponse } from '../utils';

export function schemaValidationError(
    err: ValidationError,
    _req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err?.name === 'JsonSchemaValidationError') {
        sendErrResponse(res, 422, err.validationErrors);
    }
    next();
}

//FIXME: Don't think this is actually catching errors. Likely because async function errors
//       are not automatically caught by express. (This will change in express 5.x.x)
export function unhandledErrors(
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err) {
        sendErrResponse(
            res,
            500,
            `Internal server error ${err.name}: ${err.message}`
        );
    }
    next();
}

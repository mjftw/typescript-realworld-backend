import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-json-validator-middleware';
import { errResponse } from '../utils';

export function schemaValidationError(
    err: ValidationError,
    _req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err?.name !== 'JsonSchemaValidationError') {
        next(err);
    }

    res.status(422).json(errResponse(err.validationErrors));
}

export function unhandledErrors(
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err) {
        res.status(500).send(
            errResponse(`Internal server error ${err.name}: ${err.message}`)
        );
        return;
    }
    next();
}

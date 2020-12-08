import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-json-validator-middleware';

export default function schemaValidationError(
    err: ValidationError,
    _req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err?.name !== 'JsonSchemaValidationError') {
        next(err);
    }

    res.status(422).json({
        errors: err.validationErrors,
    });
}

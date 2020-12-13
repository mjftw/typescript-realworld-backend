// These environment variables are required to run the app, so error immediately
// if they are undefined.
requireEnvVars(['JWT_SECRET', 'DB_NAME', 'DB_USERNAME', 'DB_PASSWORD']);

// Export configuration to be used throughout app

// Required vars are cast to strings to keep the typescript compiler happy
// This is okay because we've already checked that they're not undefined
export const jwtSecret = process.env.JWT_SECRET as string;
export const dbName = process.env.DB_NAME as string;
export const dbUser = process.env.DB_USERNAME as string;
export const dbPass = process.env.DB_PASSWORD as string;

// Optional env
export const appPort = parseInt(process.env.APP_PORT || '4000');
export const dbHost = process.env.DB_HOST || 'localhost';
export const dbPort = parseInt(process.env.DB_PORT || '5432');

// Static env
export const saltLength = 32;
export const jtwHmacAlgorithm = 'HS256';
export const logResponseErrors = true;

export function requireEnvVars(envNames: string[]): void {
    const missing = envNames.filter(
        (envName) => process.env[envName] === undefined
    );

    if (missing.length != 0) {
        throw `Required environment variables undefined: ${missing.join(', ')}`;
    }
}

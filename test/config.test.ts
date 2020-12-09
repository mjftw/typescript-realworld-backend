import { requireEnvVars } from '../src/config';

test('requireEnvVars errors on undefined env', () => {
    expect(() => requireEnvVars(['AH3HBD9ET3IPKW', 'DSFSDFSDF232'])).toThrow(
        /Required environment variables undefined: AH3HBD9ET3IPKW, DSFSDFSDF232/
    );
});

import * as auth from '../../src/common/auth';
import { jwtSecret } from '../../src/config';

test('newAuthJwt creates a string matching JWT regex', () => {
    const jwt = auth.newAuthJwt(42, jwtSecret);
    expect(jwt).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    );
});

test('newSalt returns hex of correct length', () => {
    const salt = auth.newSalt(32);
    expect(salt).toMatch(/^[0-9a-fA-F]{32}$/);
});

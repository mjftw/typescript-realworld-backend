import * as auth from '../../src/common/auth';
import { jwtSecret } from '../../src/config';

test('newAuthJwt creates a string matching JWT regex', () => {
    const jwt = auth.newAuthJwt(42, jwtSecret);
    expect(jwt).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    );
});

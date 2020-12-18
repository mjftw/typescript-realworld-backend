import { createSlug } from '../../src/common/slugs';

it('createSlug replaces non-word chars with "-"', () => {
    expect(createSlug('the!quick+brown~fox jumped-over[the]lazy$dog')).toMatch(
        'the-quick-brown-fox-jumped-over-the-lazy-dog'
    );
});

it('createSlug removes duplicate "-"', () => {
    expect(createSlug('hello--world---123')).toMatch('hello-world-123');
});

it('createSlug lowercases words', () => {
    expect(createSlug('HeLLo-World-123')).toMatch('hello-world-123');
});

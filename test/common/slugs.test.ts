import { createSlug } from '../../src/common/slugs';

it('createSlug replaces non-word chars with "-"', () => {
    expect(createSlug('the!quick+brown~fox jumped-over[the]lazy$dog')).toEqual(
        'the-quick-brown-fox-jumped-over-the-lazy-dog'
    );
});

it('createSlug removes duplicate "-"', () => {
    expect(createSlug('hello--world---123')).toEqual('hello-world-123');
});

it('createSlug removes leading and trailing "-"', () => {
    expect(createSlug('--hello--world-123-')).toEqual('hello-world-123');
});

it('createSlug lowercases words', () => {
    expect(createSlug('HeLLo-World-123')).toEqual('hello-world-123');
});

export function createSlug(msg: string): string {
    let slug = msg;

    // Replace all non-word chars
    slug = slug.replace(/\W/g, '-');

    // Remove duplicate "-" chars
    slug = slug
        .split('')
        .reduce((str, char) =>
            str.charAt(str.length - 1) === '-' && char === '-'
                ? str
                : str + char
        );

    slug = slug.toLowerCase();
    slug = slug.replace(/(^-*|-*$)/g, '');

    return slug;
}

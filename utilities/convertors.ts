
const slugCharacters = ' -12345890abcdefghijklmnopqrstuvwxyz';

export function convertToSlug(text: string) {
  return (text
    .split('')
    .map(it => it === ' ' ? '-' : it.toLowerCase())
    .filter(it => slugCharacters.includes(it))
    .join('')
  );
}


export function generateUUID(parts = 3) {
  return (Array(parts).fill('').map(() => Math.random())
    .map(it => it.toString(22))
    .map(it => it.slice(2))
    .join('-')
  );
}

export function generateRandomDigits(digits: number): string {

  let result = '';

  for (let i = 0; i < digits; i++) {
    result += String(Math.random())[2];
  }

  return result;

}

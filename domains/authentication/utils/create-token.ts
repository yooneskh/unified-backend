

export function createToken(units = 4) {
  
  const result: string[] = [];

  for (let i = 0; i < units; i++) {
    result.push(
      Math.random().toString(16).slice(2)
    );
  }

  return result.join('-');

}

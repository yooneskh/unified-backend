

export function createVerificationCode(length = 4) {
  
  let code = '';
  const set = '0123456789';

  for (let i = 0; i < length; i++) {
    code += set[Math.floor(Math.random() * set.length)];
  }

  return code;

}

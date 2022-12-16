
const phoneNumberRegex = /^\+98[0-9]{10}$/;

export function isPhoneNumber(text: unknown) {
  return typeof text === 'string' && phoneNumberRegex.test(text);
}


const slugRegex = /[a-z0-9\-]+/;

export function isSlug(text: unknown) {
  return typeof text === 'string' && slugRegex.test(text);
}


const emailRegex = /.+@.+\..+/;

export function isEmail(text: unknown) {
  return typeof text === 'string' && emailRegex.test(text);
}

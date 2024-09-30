

export const Config = {
  http: {
    port: 8081,
  },
  database: {
    path: '../db/db.kv',
  },
  media: {
    directory: 'media',
    baseUrl: 'https://localhost:8080',
  },
  authentication: {
    verificationTokenStaticCode: '1111',
    verificationTokenLength: 4,
    verificationTokenLifetime: 1000 * 60 * 3,
    registrationTokenLifetime: 1000 * 60 * 3,
    authenticationTokenUnits: 4,
    authenticationTokenLifetime: 1000 * 60 * 60 * 24 * 30,
  },
  authorization: {
    userDefaultPermissions: [ 'user.**' ],
    prepopulateUsers: [
      {
        email: 'yooneskh@gmail.com',
        permissions: [ 'user.**', 'admin.**', 'special.**' ],
      },
    ],
  },
  captcha: {
    length: 5,
    lifetime: 1000 * 60 * 2
  },
  resend: {
    authorization: '',
    from: 'Unified Backend <noreply@mail.khoshghadam.com>',
  },
  kavenegar: {
    apiKey: '',
  },
};

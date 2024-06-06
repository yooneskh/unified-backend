

export const Config = {
  database: {
    path: './db.kv',
  },
  media: {
    directory: 'media',
    baseUrl: 'https://localhost:8080',
  },
  authentication: {
    verificationTokenStaticCode: '1111',
    verificationTokenLength: 4,
    verificationTokenLifetime: 1000 * 60 * 2,
    registrationTokenLifetime: 1000 * 60 * 2,
    authenticationTokenUnits: 4,
    authenticationTokenLifetime: 30 * 24 * 60 * 1000,
  },
  authorization: {
    userDefaultPermissions: [ 'user.**' ],
    prepopulateUsers: [
      {
        name: 'Yoones Khoshghadam',
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
};

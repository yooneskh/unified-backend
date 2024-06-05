

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
    verificationTokenLifetime: 120_000,
    registrationTokenLifetime: 120_000,
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
  resend: {
    authorization: 'Bearer re_fvKea5XU_KaDsuqHgQCbG6THN477Tesip',
    from: 'Unified Backend <noreply@mail.khoshghadam.com>',
  },
};

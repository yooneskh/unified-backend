

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
};

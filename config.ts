import { augmentConfiguration } from 'deno_config';


export const Config = {
  database: {
    enabled: true,
    host: '127.0.0.1',
    port: 27017,
    name: '{{app.id}}',
    connectionString: '',
  },
  http: {
    enabled: true,
    port: 8080,
  },
  media: {
    cwd: '/home/yooneskh/{{app.id}}-server',
    directory: 'media',
    baseUrl: 'https://api.{{app.domain}}/',
  },
  captcha: {
    lifetime: 1000 * 60 * 3,
  },
  authentication: {
    staticVerificationCode: '111111',
    randomDigitsCount: 6,
    tokenLifetime: 1000 * 60 * 60 * 24 * 30,
  },
  authorization: {
    defaultPermissions: ['user.**'],
  },
  payment: {
    core: {
      verificationCallback: 'https://api.{{app.domain}}/api/paytickets',
    },
    zarinpal: {
      merchantId: '',
      sandbox: true,
    },
    default: {
      locale: 'en' as 'en' | 'fa',
      favicon: '{{app.website.url}}/favicon.ico',
      font: 'https://cdn.khoshghadam.com/font/roboto/roboto.css',
      title: '{{app.name.en}} | Payment Result',
      callback: '{{app.website.url}}',
      supportCallback: '{{app.website.url}}',
    },
    en: {
      locale: 'en' as 'en' | 'fa',
      favicon: '{{app.website.url}}/favicon.ico',
      font: 'https://cdn.khoshghadam.com/font/roboto/roboto.css',
      title: '{{app.name.en}} | Payment Result',
      callback: '{{app.website.url}}',
      supportCallback: '{{app.website.url}}',
    },
    fa: {
      locale: 'fa' as 'en' | 'fa',
      favicon: '{{app.website.url}}/favicon.ico',
      font: 'https://cdn.khoshghadam.com/font/iryekan/iryekan.css',
      title: '{{app.name.fa}} | نتیجه پرداخت',
      callback: '{{app.website.url}}',
      supportCallback: '{{app.website.url}}',
    },
  },
  notifications: {
    kavenegar: {
      apiKey: '',
    },
    sendInBlue: {
      apiKey: '',
    },
    smtp: {
      host: '',
      port: 25,
      username: '',
      password: '',
    },
  },
  accounting: {
    specialAccounts: [
      {
        name: 'Global Source',
        identifier: 'global-source',
        balance: 0,
        acceptsInput: false,
        acceptsOutput: true,
        allowsNegativeBalance: true,
      },
      {
        name: 'Global Drain',
        identifier: 'global-drain',
        balance: 0,
        acceptsInput: true,
        acceptsOutput: false,
        allowsNegativeBalance: false,
      },
    ],
  },
};


augmentConfiguration(Config);

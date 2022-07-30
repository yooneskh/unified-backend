import { VerificationTokenMaker } from './resource.ts';


VerificationTokenMaker.setProperties({
  user: {
    type: 'string',
    ref: 'User',
    title: 'کاربر',
    titleable: true
  },
  registerToken: {
    type: 'string',
    ref: 'RegisterToken',
    title: 'بلیط ثبت نام'
  },
  channel: {
    type: 'string',
    enum: ['sms', 'email'],
    required: true,
    title: 'کانال',
    titleable: true
  },
  channelIdentifier: {
    type: 'string',
    required: true,
    title: 'نشانگر کانال',
    titleable: true
  },
  code: {
    type: 'string',
    required: true,
    title: 'کد',
    titleable: true
  },
  used: {
    type: 'boolean',
    title: 'استفاده شده'
  },
  usedAt: {
    type: 'number',
    title: 'زمان استفاده'
  }
});


VerificationTokenMaker.makeModel();

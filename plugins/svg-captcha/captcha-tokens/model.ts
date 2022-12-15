import { CaptchaTokenMaker } from './resource.ts';


CaptchaTokenMaker.setProperties({
  text: {
    type: 'string',
    required: true,
    title: 'مقدار',
    titleable: true
  },
  validUntil: {
    type: 'number',
    required: true,
    title: 'زمان اعتبار'
  },
  resolved: {
    type: 'boolean',
    title: 'بررسی شده'
  },
  resolvedAt: {
    type: 'number',
    title: 'زمان بررسی'
  },
  resolveFailure: {
    type: 'boolean',
    title: 'بررسی ناموفق'
  }
});


CaptchaTokenMaker.makeModel();

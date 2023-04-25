import { RegisterTokenMaker } from './resource.ts';


RegisterTokenMaker.setProperties({
  name: {
    type: 'string',
    required: true,
    title: 'نام',
    titleable: true
  },
  phoneNumber: {
    type: 'string',
    title: 'شماره تلفن',
    titleable: true
  },
  email: {
    type: 'string',
    title: 'ایمیل',
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


RegisterTokenMaker.makeModel();

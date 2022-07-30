import { UserMaker } from './resource.ts';


UserMaker.setProperties({
  name: {
    type: 'string',
    required: true,
    title: 'نام',
    titleable: true
  },
  email: {
    type: 'string',
    title: 'ایمیل'
  },
  phoneNumber: {
    type: 'string',
    title: 'شماره تلفن'
  },
  profile: {
    type: 'string',
    ref: 'Media',
    title: 'تصویر پروفایل'
  }
});


UserMaker.makeModel();

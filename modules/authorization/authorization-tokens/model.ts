import { AuthorizationTokenMaker } from './resource.ts';


AuthorizationTokenMaker.setProperties({
  user: {
    type: 'string',
    ref: 'User',
    required: true,
    title: 'کاربر',
    titleable: true
  },
  permissions: {
    type: 'string',
    array: true,
    title: 'مجوز‌ها'
  },
  roles: {
    type: 'string',
    ref: 'AuthorizationRole',
    array: true,
    title: 'نقش‌ها'
  }
});


AuthorizationTokenMaker.makeModel();

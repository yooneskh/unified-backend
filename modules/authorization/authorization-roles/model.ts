import { AuthorizationRoleMaker } from './resource.ts';


AuthorizationRoleMaker.setProperties({
  name: {
    type: 'string',
    required: true,
    title: 'نام',
    titleable: true
  },
  permissions: {
    type: 'string',
    array: true,
    required: true,
    title: 'مجوز‌ها'
  }
});


AuthorizationRoleMaker.makeModel();

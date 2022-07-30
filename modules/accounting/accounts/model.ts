import { AccountMaker } from './resource.ts';


AccountMaker.setProperties({
  name: {
    type: 'string',
    title: 'نام',
    titleable: true
  },
  user: {
    type: 'string',
    ref: 'User',
    title: 'کاربر',
    titleable: true
  },
  identifier: {
    type: 'string',
    title: 'شناسه'
  },
  balance: {
    type: 'number',
    required: true,
    title: 'موجودی'
  },
  acceptsInput: {
    type: 'boolean',
    required: true,
    title: 'قابل ورود'
  },
  acceptsOutput: {
    type: 'boolean',
    required: true,
    title: 'قابل خروج'
  },
  allowNegativeBalance: {
    type: 'boolean',
    required: true,
    title: 'قابل منفی شدن'
  },
  meta: {
    type: 'object',
    hidden: true
  }
});


AccountMaker.makeModel();

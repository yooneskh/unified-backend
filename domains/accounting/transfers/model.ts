import { TransferMaker } from './resource.ts';


TransferMaker.setProperties({
  fromAccount: {
    type: 'string',
    ref: 'Account',
    required: true,
    title: 'حساب مبدا',
    titleable: true
  },
  toAccount: {
    type: 'string',
    ref: 'Account',
    required: true,
    title: 'حساب مقصد',
    titleable: true
  },
  amount: {
    type: 'number',
    required: true,
    title: 'میزان',
    titleable: true
  },
  description: {
    type: 'string',
    title: 'توضیحات'
  }
});


TransferMaker.makeModel();

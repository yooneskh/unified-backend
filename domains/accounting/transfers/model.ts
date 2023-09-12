import { TransferMaker } from './resource.ts';


TransferMaker.setProperties({
  fromAccount: {
    type: 'string',
    ref: 'Account',
    required: true,
    titleable: true
  },
  toAccount: {
    type: 'string',
    ref: 'Account',
    required: true,
    titleable: true
  },
  amount: {
    type: 'number',
    required: true,
    titleable: true
  },
  description: {
    type: 'string',
  }
});


TransferMaker.makeModel();

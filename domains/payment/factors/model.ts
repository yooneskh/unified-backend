import { FactorMaker } from './resource.ts';


FactorMaker.setProperties({
  name: {
    type: 'string',
    required: true,
    title: 'نام',
    titleable: true
  },
  amount: {
    type: 'number',
    required: true,
    title: 'مقدار'
  },
  user: {
    type: 'string',
    ref: 'User',
    title: 'کاربر'
  },
  payed: {
    type: 'boolean',
    title: 'پرداخت شده'
  },
  payedAt: {
    type: 'number',
    title: 'زمان پرداخت'
  },
  payticket: {
    type: 'string',
    ref: 'Payticket',
    title: 'بلیط پرداخت'
  },
  meta: {
    type: 'object',
    hidden: true
  }
});


FactorMaker.makeModel();

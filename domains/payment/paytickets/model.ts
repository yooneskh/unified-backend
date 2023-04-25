import { PayticketMaker } from './resource.ts';


PayticketMaker.setProperties({
  factor: {
    type: 'string',
    ref: 'Factor',
    required: true,
    title: 'فاکتور',
    titleable: true
  },
  gateway: {
    type: 'string',
    required: true,
    title: 'درگاه'
  },
  amount: {
    type: 'number',
    required: true,
    title: 'مقدار'
  },
  payUrl: {
    type: 'string',
    title: 'آدرس پرداخت'
  },
  returnUrl: {
    type: 'string',
    title: 'آدرس بازگشت'
  },
  locale: {
    type: 'string',
    title: 'زبان'
  },
  resolved: {
    type: 'boolean',
    title: 'معین شده'
  },
  resolvedAt: {
    type: 'number',
    title: 'زمان معین شدن'
  },
  payed: {
    type: 'boolean',
    title: 'پرداخت شده'
  },
  payedAt: {
    type: 'number',
    title: 'زمان پرداخت'
  },
  rejected: {
    type: 'boolean',
    title: 'رد شده'
  },
  rejectedAt: {
    type: 'number',
    title: 'زمان رد'
  },
  rejectedFor: {
    type: 'string',
    title: 'علت رد'
  },
  meta: {
    type: 'object',
    hidden: true
  }
});


PayticketMaker.makeModel();

import { PayticketMaker } from './resource.ts';


PayticketMaker.setProperties({
  factor: {
    type: 'string',
    ref: 'Factor',
    required: true,
    titleable: true
  },
  gateway: {
    type: 'string',
    required: true,
  },
  amount: {
    type: 'number',
    required: true,
  },
  payUrl: {
    type: 'string',
  },
  returnUrl: {
    type: 'string',
  },
  locale: {
    type: 'string',
    enum: ['en', 'fa'],
    items: [
      { value: 'en', title: 'English' },
      { value: 'fa', title: 'Farsi' },
    ],
  },
  resolved: {
    type: 'boolean',
  },
  resolvedAt: {
    type: 'number',
  },
  payed: {
    type: 'boolean',
  },
  payedAt: {
    type: 'number',
  },
  rejected: {
    type: 'boolean',
  },
  rejectedAt: {
    type: 'number',
  },
  rejectedFor: {
    type: 'string',
  },
  meta: {
    type: 'object',
    hidden: true
  }
});


PayticketMaker.makeModel();

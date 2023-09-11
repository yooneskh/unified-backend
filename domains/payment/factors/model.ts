import { FactorMaker } from './resource.ts';


FactorMaker.setProperties({
  name: {
    type: 'string',
    required: true,
    titleable: true,
  },
  amount: {
    type: 'number',
    required: true,
  },
  user: {
    type: 'string',
    ref: 'User',
  },
  payed: {
    type: 'boolean',
  },
  payedAt: {
    type: 'number',
    labelFormat: 'YYYY/MM/DD HH:mm',
  },
  payticket: {
    type: 'string',
    ref: 'Payticket',
  },
  meta: {
    type: 'object',
    hidden: true,
  }
});


FactorMaker.makeModel();

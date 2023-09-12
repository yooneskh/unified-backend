import { AccountMaker } from './resource.ts';


AccountMaker.setProperties({
  name: {
    type: 'string',
    titleable: true
  },
  user: {
    type: 'string',
    ref: 'User',
    titleable: true
  },
  identifier: {
    type: 'string',
  },
  balance: {
    type: 'number',
    required: true,
  },
  acceptsInput: {
    type: 'boolean',
    required: true,
  },
  acceptsOutput: {
    type: 'boolean',
    required: true,
  },
  allowNegativeBalance: {
    type: 'boolean',
    required: true,
  },
  meta: {
    type: 'object',
    hidden: true
  }
});


AccountMaker.makeModel();

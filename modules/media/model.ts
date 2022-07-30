import { MediaMaker } from './resource.ts';


MediaMaker.setProperties({
  owner: {
    type: 'string',
    ref: 'User',
    title: 'صاحب'
  },
  name: {
    type: 'string',
    required: true,
    title: 'نام',
    titleable: true
  },
  extension: {
    type: 'string',
    required: true,
    title: 'فرمت',
    titleable: true
  },
  size: {
    type: 'number',
    required: true,
    title: 'حجم'
  },
  type: {
    type: 'string',
    title: 'نوع'
  },
  relativePath: {
    type: 'string',
    required: true,
    title: 'مسیر نسبی'
  },
  path: {
    type: 'string',
    required: true,
    title: 'مسیر'
  },
  variantRelatives: {
    type: 'object',
    title: 'مسیر انواع',
    hidden: true
  },
  variants: {
    type: 'object',
    title: 'انواع',
    hidden: true
  }
});


MediaMaker.makeModel();

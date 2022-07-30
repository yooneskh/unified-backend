import { registerMediaValidator } from '../globals.ts';


const ALLOWED_MEDIA_MIME_TYPES = [
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

registerMediaValidator(media => {

  if (!media.type) {
    throw new Error('media is not recognized')
  }

  if (!ALLOWED_MEDIA_MIME_TYPES.includes(media.type)) {
    throw new Error('media is not allowed')
  }

});

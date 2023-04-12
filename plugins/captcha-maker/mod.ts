import { createCanvas } from '../../deps.ts';


export interface ICaptchaCreate {
  width?: number;
  height?: number;
  length?: number;
  dictionary?: string[];
  skew?: number;
}

export function createCaptcha(params: ICaptchaCreate) {

  const captchaWidth = params.width ?? 150;
  const captchaHeight = params.height ?? 50;
  const captchaLength = params.length ?? 6;
  const skewAngle = params.skew ?? 0.7;

  const dictionary = params.dictionary ?? ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];


  let captchaText = '';

  while (captchaText.length < captchaLength) {
    captchaText += dictionary[ Math.floor(Math.random() * dictionary.length) ];
  }


  const canvas = createCanvas(captchaWidth, captchaHeight);
  const ctx = canvas.getContext('2d');


  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, captchaWidth, captchaHeight);

  ctx.transform(1, 0, 2 * skewAngle * Math.random() - skewAngle, 1, 0, 0);

  ctx.font = '30px Arial';
  ctx.fillStyle = '#000000';
  ctx.fillText(captchaText, 12, 35);

  ctx.setTransform(1, 0, 0, 1, 0, 0);


  return {
    text: captchaText,
    data: canvas.toDataURL(),
  };

}

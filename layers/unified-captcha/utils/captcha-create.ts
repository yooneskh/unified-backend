// import { createCanvas } from 'skia-canvas';


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
  // const skewAngle = params.skew ?? 0.7;

  const dictionary = params.dictionary ?? ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];


  let captchaText = '';

  while (captchaText.length < captchaLength) {
    captchaText += dictionary[ Math.floor(Math.random() * dictionary.length) ];
  }

  return {
    text: captchaText,
    data: `<svg viewBox="0 0 ${captchaWidth} ${captchaHeight}" xmlns="http://www.w3.org/2000/svg"><text x="0" y="20">${captchaText}</text></svg>`,
  }

  // const canvas = createCanvas(captchaWidth, captchaHeight);
  // const ctx = canvas.getContext('2d');


  // ctx.fillStyle = 'transparent';
  // ctx.fillRect(0, 0, captchaWidth, captchaHeight);

  // ctx.transform(1, 0, 2 * skewAngle * Math.random() - skewAngle, 1, 0, 0);

  // ctx.font = '30px Arial';
  // ctx.fillStyle = '#000000';
  // ctx.fillText(captchaText, 12, 35);

  // ctx.setTransform(1, 0, 0, 1, 0, 0);


  // const textWidth = ctx.measureText(captchaText).width;
  // const lineWidth = 2;
  // const lineColor = "red";

  // ctx.strokeStyle = lineColor;
  // ctx.lineWidth = lineWidth;
  // ctx.beginPath();
  // ctx.moveTo(20, 22);
  // ctx.lineTo(20 + textWidth, 22);
  // ctx.stroke();
  // ctx.moveTo(20, 27);
  // ctx.lineTo(20 + textWidth, 27);
  // ctx.stroke();

  // ctx.setTransform(1, 0, 0, 1, 0, 0);


  // return {
  //   text: captchaText,
  //   data: canvas.toDataURL(),
  // };

}



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

  const dictionary = params.dictionary ?? ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];


  let captchaText = '';

  while (captchaText.length < captchaLength) {
    captchaText += dictionary[ Math.floor(Math.random() * dictionary.length) ];
  }

  return {
    text: captchaText,
    data: `<svg viewBox="0 0 ${captchaWidth} ${captchaHeight}" xmlns="http://www.w3.org/2000/svg"><text x="0" y="20">${captchaText}</text></svg>`,
  }

}

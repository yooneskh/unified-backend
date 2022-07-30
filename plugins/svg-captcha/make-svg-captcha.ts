import { generateRandomDigits } from '../../tools/generators.ts';


export function makeSvgCaptcha() {

  const code = generateRandomDigits(6);

  const captcha = {
    text: code,
    svgContext: `<svg viewBox="0 0 69 14">
      <text x="50%" y="98%" text-anchor="middle">
        ${code}
      </text>
    </svg>`
  }

  return {
    text: captcha.text,
    svg: captcha.svgContext
  };

}

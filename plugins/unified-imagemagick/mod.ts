import {
  ImageMagick,
  IMagickImage,
  initializeImageMagick,
  MagickFormat,
  MagickGeometry,
} from "imagemagick_deno";

let isImageMagickInitialized = false;


export interface IConvertWebp {
  inputFilePath: string;
  outputFilePath: string;
  width?: number;
  height?: number;
}

export async function transformToWebp({ inputFilePath, outputFilePath, width, height }: IConvertWebp) {

  if (!isImageMagickInitialized) {
    await initializeImageMagick();
    isImageMagickInitialized = true;
  }


  return new Promise((resolve, reject) => {

    (Deno.readFile(inputFilePath)
      .then(inputData => {

        if (!inputData) {
          return reject('could not read file');
        }

        ImageMagick.read(inputData, (image: IMagickImage) => {

          if (!inputData) {
            return reject('image magick could not read file');
          }

          image.resize(new MagickGeometry((!width ? '' : Math.min(width, image.width)) + 'x' + (!height ? '' : Math.min(height, image.height))))

          image.write((outData: Uint8Array) => {
            (Deno.writeFile(outputFilePath, outData)
              .then(resolve)
              .catch(reject)
            );
          }, MagickFormat.Webp);

        });

      })
      .catch(reject)
    );

  });

}

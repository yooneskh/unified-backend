import {
  ImageMagick,
  IMagickImage,
  initializeImageMagick,
  MagickFormat,
  MagickGeometry,
} from "https://deno.land/x/imagemagick_deno@0.0.19/mod.ts";

let isImageMagickInitialized = false;


// function readImage(filePath: string) {
//   return new Promise<IMagickImage>((resolve, reject) => {
//     Deno.readFile(filePath)
//       .then(fileData => {

//         ImageMagick.read(fileData, (image: IMagickImage) => {

//           if (!image) {
//             return reject('could not read file data');
//           }

//           resolve(image);

//         });

//       })
//       .catch(reject)
//   })
// }

// function writeImage(image: IMagickImage, filePath: string, format: MagickFormat) {
//   return new Promise((resolve, reject) => {
//     image.write((data: Uint8Array) => {

//       if (!data) {
//         return reject('could not get image data to write');
//       }

//       (Deno.writeFile(filePath, data)
//         .then(resolve)
//         .catch(reject)
//       );

//     }, format);
//   });
// }

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

  // const image = await readImage(inputFilePath);
  // image.resize(new MagickGeometry((!width ? '' : Math.min(width, image.width)) + 'x' + (!height ? '' : Math.min(height, image.height))))
  // await writeImage(image, outputFilePath, MagickFormat.Webp);

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

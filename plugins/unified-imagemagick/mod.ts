import {
  ImageMagick,
  IMagickImage,
  initializeImageMagick,
  MagickFormat,
  MagickGeometry,
} from "https://deno.land/x/imagemagick_deno@0.0.19/mod.ts";


function readImageMagick(filePath: string): Promise<IMagickImage> {
  return new Promise((resolve, reject) => {
    Deno.readFile(filePath)
      .then(fileData => {
        ImageMagick.read(fileData, resolve)
      })
      .catch(reject)
  });
}

function writeImageMagick(image: IMagickImage, format: MagickFormat, filePath: string) {
  return new Promise((resolve, reject) => {
    image.write(
      (data) => {

        if (!data) {
          reject();
        }

        Deno.writeFile(filePath, data)
          .then(resolve)
          .catch(reject);

      },
      format
    );
  })
}


let isImageMagickInitialized = false;

export async function transformToWebp(inputFilePath: string, outputFilePath: string, width?: number, height?: number) {

  if (!isImageMagickInitialized) {
    await initializeImageMagick();
    isImageMagickInitialized = true;
  }


  const image = await readImageMagick(inputFilePath);

  image.resize(new MagickGeometry((!width ? '' : Math.min(width, image.width)) + 'x' + (!height ? '' : Math.min(height, image.height))))

  await writeImageMagick(image, MagickFormat.Webp, outputFilePath);

}
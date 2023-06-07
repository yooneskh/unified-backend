import { Config } from 'config';
import { setupHttpTransport } from '../transports/http.ts';


export function bootstrap(timeStart: number) {

  if (!Config.http.port) {
    throw new Error('http listen port not provided');
  }

  const httpListenAddress = `:${Config.http.port}`;


  return new Promise<void>((resolve, reject) => {
    try {
      setupHttpTransport(Config.http.port, () => {
        console.log(`http service listening on ${httpListenAddress} -- time took: ${Date.now() - timeStart} ms`);
        resolve();
      });
    }
    catch (error) {
      reject(error);
    }
  });

}

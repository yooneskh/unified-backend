import { Config } from '../config.ts';
import { setupHttpTransport } from '../transports/http.ts';


export function bootstrap(timeStart: number) {

  if (!Config.http.port) {
    throw new Error('http listen port not provided');
  }

  const httpListenAddress = `:${Config.http.port}`;

  setupHttpTransport(Config.http.port, () => {
    console.log(`http service listening on ${httpListenAddress} -- time took: ${Date.now() - timeStart} ms`);
  });

}

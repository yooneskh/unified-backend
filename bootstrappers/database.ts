import { Config } from '../config.ts';
import { connect } from '../deps.ts';


export async function bootstrap() {

  if (!( Config.database.connectionString || (Config.database.host && Config.database.port && Config.database.name) )) {
    throw new Error('database connection information is insufficient');
  }

  const connectionString = Config.database.connectionString || `mongo://${Config.database.host}:${Config.database.port}/${Config.database.name}`;
  await connect(connectionString);

}

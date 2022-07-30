import { bootstrap } from '../bootstrappers/database.ts';
import { UserController } from '../modules/users/controller.ts';
import { IUser } from '../modules/users/interfaces.d.ts';
import { AuthorizationTokenController } from '../modules/authorization/authorization-tokens/controller.ts';
import { IAuthorizationToken } from '../modules/authorization/authorization-tokens/interfaces.d.ts';


const USER_NAME = 'یونس خوش قدم';
const USER_PHONE_NUMBER = '+989364524952';
const USER_EMAIL = 'yooneskh@gmail.com';
const USER_PERMISSIONS = ['user.**', 'admin.**']


await bootstrap();

let user: IUser | undefined = undefined;
let authorizationToken: IAuthorizationToken | undefined = undefined;


try {

  user = await UserController.create({
    document: {
      name: USER_NAME,
      phoneNumber: USER_PHONE_NUMBER,
      email: USER_EMAIL
    }
  });

  authorizationToken = await AuthorizationTokenController.create({
    document: {
      user: String(user._id),
      permissions: USER_PERMISSIONS,
      roles: []
    }
  });

  console.log('user created', { user, authorizationToken });

}
catch (error: unknown) {

  if (user) {
    await UserController.delete({ resourceId: user._id });
  }

  if (authorizationToken) {
    await AuthorizationTokenController.delete({ resourceId: authorizationToken._id });
  }

  console.log('could not create user. cleanup complete.');
  console.error(error);

}


Deno.exit(0);

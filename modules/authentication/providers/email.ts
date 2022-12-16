import { registerProvider } from '../authentication-router/router.ts';
import { Config } from '../../../config.ts';
import { UserController } from '../../users/controller.ts';
import { VerificationTokenController } from '../verification-tokens/controller.ts';
import { RegisterTokenController } from '../register-tokens/controller.ts';
import { NotFoundError } from '../../../plugins/error/handleable-error.ts';
import { generateRandomDigits } from '../../../utilities/generators.ts';


registerProvider({
  identifier: 'email',
  async login({ payload }) {

    const { email } = payload;

    const user = await UserController.findBy({
      filters: {
        email
      }
    });

    if (!user) {
      throw new NotFoundError(`user with this email ${email} was not found`);
    }

    const verificationToken = await VerificationTokenController.create({
      document: {
        user: String(user._id),
        channel: 'email',
        channelIdentifier: email,
        code: Config.authentication.staticVerificationCode || generateRandomDigits(Config.authentication.randomDigitsCount)
      }
    });

    return {
      needsVerification: true,
      verificationToken: String(verificationToken._id)
    };

  },
  async register({ payload }) {

    const { name, email } = payload;

    const prevUsers = await UserController.count({
      filters: {
        email
      }
    });

    if (prevUsers !== 0) {
      throw new Error(`user with this email exists ${email}`);
    }

    const registerToken = await RegisterTokenController.create({
      document: {
        name,
        email
      }
    });

    const verificationToken = await VerificationTokenController.create({
      document: {
        registerToken: String(registerToken._id),
        channel: 'email',
        channelIdentifier: email,
        code: Config.authentication.staticVerificationCode || generateRandomDigits(Config.authentication.randomDigitsCount)
      }
    });

    return {
      needsVerification: true,
      verificationToken: String(verificationToken._id)
    };

  },
  async verify({ payload }) {

    const { verificationToken, verificationCode } = payload;

    const verificationTokenDocument = await VerificationTokenController.retrieve({
      resourceId: verificationToken
    });

    if (verificationTokenDocument.used) {
      throw new Error('this verification token has been used before');
    }

    if (verificationTokenDocument.code !== verificationCode) {
      throw new Error('verification code is invalid');
    }

    if (!verificationTokenDocument.user && !verificationTokenDocument.registerToken) {
      throw new Error(`verification token has no user neither register token ${verificationToken}`);
    }

    let user = '';

    if (verificationTokenDocument.user) {
      user = verificationTokenDocument.user;
    }
    else if (verificationTokenDocument.registerToken) {

      const registerToken = await RegisterTokenController.retrieve({
        resourceId: verificationTokenDocument.registerToken
      });

      if (registerToken.used) {
        throw new Error(`register token has been used ${registerToken._id}`);
      }

      if (!registerToken.email) {
        throw new Error('register token does not have email');
      }

      const userDocument = await UserController.create({
        document: {
          name: registerToken.name,
          email: registerToken.email
        }
      });

      await RegisterTokenController.update({
        resourceId: registerToken._id,
        payload: {
          used: true,
          usedAt: Date.now()
        }
      });

      user = String(userDocument._id);

    }

    await VerificationTokenController.update({
      resourceId: verificationToken,
      payload: {
        used: true,
        usedAt: Date.now()
      }
    });

    return user;

  }
});

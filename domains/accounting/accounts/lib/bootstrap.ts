import { Config } from 'config';
import { AccountController } from '../controller.ts';


(async () => {

  for (const specialAccount of Config.accounting.specialAccounts) {

    const account = await AccountController.findBy({
      filters: {
        identifier: specialAccount.identifier
      }
    });

    if (!account) {
      await AccountController.create({
        document: {
          name: specialAccount.name,
          identifier: specialAccount.identifier,
          balance: specialAccount.balance,
          acceptsInput: specialAccount.acceptsInput,
          acceptsOutput: specialAccount.acceptsOutput,
          allowNegativeBalance: specialAccount.allowsNegativeBalance
        }
      });
    }

  }

})();

import { AccountMaker } from './resource.ts';
import './model.ts';


export const AccountController = AccountMaker.getController();


AccountMaker.addValidations({
  name: [
    it => (
      !it.name || !!it.identifier || 'account with name must have identifier'
    )
  ],
  user: [
    it => (
      !it.user || (!it.name && !it.identifier) || 'account with user must not have name or identifier'
    ),
    async (it, controller) => (
      !it.user || (await controller!.countLessEqualThan({ filters: { user: it.user } }, 1)) || 'each user can have at most one account'
    )
  ],
  identifier: [
    it => (
      !it.identifier || !!it.name || 'account with identifier must have name'
    )
  ],
  balance: [
    it => (
      it.balance >= 0 || it.allowNegativeBalance || 'this account balance cannot become negative'
    )
  ]
});


export async function getAccountForUser(userId: string) {

  const account = await AccountController.findBy({
    filters: {
      user: userId
    }
  });

  if (account) {
    return account;
  }


  return AccountController.create({
    document: {
      user: userId,
      balance: 0,
      acceptsInput: true,
      acceptsOutput: true,
      allowNegativeBalance: false
    }
  });

}

export function getAccountByIdentifier(identifier: string) {
  return AccountController.retrieveBy({
    filters: {
      identifier,
    }
  });
}

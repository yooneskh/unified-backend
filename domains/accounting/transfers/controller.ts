import { TransferMaker } from './resource.ts';
import './model.ts';
import { ITransfer } from './interfaces.d.ts';
import { AccountController } from '../accounts/controller.ts';


export const TransferController = TransferMaker.getController();


TransferMaker.addValidations({
  amount: [
    it => (
      it.amount > 0 || 'amount must be greater than zero'
    )
  ]
});


export async function createTransfer(fromAccountId: string, toAccountId: string, amount: number, description?: string): Promise<ITransfer> {
  if (!(amount > 0)) {
    throw new Error('transfer amount must be greater than zero');
  }

  const [fromAccount, toAccount] = await Promise.all([
    AccountController.retrieve({ resourceId: fromAccountId }),
    AccountController.retrieve({ resourceId: toAccountId })
  ]);


  if (!fromAccount.acceptsOutput) {
    throw new Error('source account does not accept output');
  }

  if (!toAccount.acceptsInput) {
    throw new Error('destination account does not accept input');
  }

  if (fromAccount.balance < amount && !fromAccount.allowNegativeBalance) {
    throw new Error('insufficient balance in source account');
  }


  const transfer = await TransferController.create({
    document: {
      fromAccount: fromAccountId,
      toAccount: toAccountId,
      amount,
      description
    }
  });

  await Promise.all([
    AccountController.update({
      resourceId: fromAccountId,
      payload: {
        balance: fromAccount.balance - amount
      }
    }),
    AccountController.update({
      resourceId: toAccountId,
      payload: {
        balance: toAccount.balance + amount
      }
    })
  ]);


  return transfer;

}


export function getGlobalSourceAccount() {
  return AccountController.retrieveBy({
    filters: {
      identifier: 'global-source'
    }
  });
}

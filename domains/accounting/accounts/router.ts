import { AccountMaker } from './resource.ts';
import './controller.ts';
import { UserController } from '../../users/controller.ts';


AccountMaker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.accounting.account.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.accounting.account.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.accounting.account.retrieve'
  },
  'create': {
    template: 'create',
    permission: 'admin.accounting.account.create'
  },
  'update': {
    template: 'update',
    permission: 'special.accounting.account.update'
  },
  'delete': {
    template: 'delete',
    permission: 'special.accounting.account.delete',
    stateValidators: [
      async ({ resourceId, controller }) => {

        const account = await controller.retrieve({ resourceId });

        const usersCount = await UserController.count({
          filters: {
            _id: account.user
          }
        });

        if (usersCount !== 0) {
          throw new Error('there is a user for this account');
        }

      }
    ]
  },
  'retrieve mine': {
    method: 'get',
    path: '/retrieve/mine',
    signal: 'Route.Account.RetrieveMine',
    permission: 'user.accounting.account.retrieve-mine',
    provider: ({ user, controller }) => {

      return controller.retrieveBy({
        filters: {
          user: String(user!._id)
        }
      });

    }
  }
});


export const AccountRouter = AccountMaker.getRouter();

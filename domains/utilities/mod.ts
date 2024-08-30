import { IUnifiedApp } from 'unified-app';


export function install(app: IUnifiedApp) {
  app.addAction({
    method: 'get',
    path: '/admin/header/links',
    handler: () => {      
      return [
        {
          label: 'Dashboard',
          to: { name: 'admin.dashboard' },
        },
        {
          label: 'User Control',
          children: [
            {
              label: 'Users',
              to: { name: 'admin.resources', params: { resourceIdentifier: 'users' } },
            },
          ],
        },
      ];
    },
  });
}
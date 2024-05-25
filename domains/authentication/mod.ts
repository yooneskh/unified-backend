import { IUnifiedApp } from 'unified-app';
import { install as installUsers } from './users/mod.ts';


export function install(app: IUnifiedApp) {
  installUsers(app);
}
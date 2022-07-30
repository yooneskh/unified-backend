import { IResourceProperty } from '../plugins/resource-maker/resource-model.d.ts';


export const ResourceLocales: Record<string, Partial<IResourceProperty>> = {
  en: {},
  fa: {}
};


export interface MultiLocaleString {
  en: string;
  fa: string;
}

import { IResourceProperty } from 'resource-maker';


export const ResourceLocales: Record<string, Partial<IResourceProperty>> = {
  en: {},
  fa: {}
};


export interface MultiLocaleString {
  en: string;
  fa: string;
}

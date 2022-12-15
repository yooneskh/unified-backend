import { IResourceProperties, IResourceProperty } from './resource-model.d.ts';
import { matches } from '../safe-filter/matcher.ts';


// deno-lint-ignore no-explicit-any
export function validateElement<T, TF>(document: T, element: any, property: IResourceProperty, keyPath: string) {

  if (property.vIf) {
    if (!matches(property.vIf, document)) {
      return;
    }
  }

  if (property.validator) {

    if (typeof property.validator === 'string') {
      if (!new RegExp(property.validator).test(element)) {
        throw new Error(`${keyPath} does not conform to ${property.validator} regex.`);
      }
    }
    else if (property.validator instanceof RegExp) {
      if (!property.validator.test(element)) {
        throw new Error(`${keyPath} does not conform to conditions.`);
      }
    }
    else {

      try {

        const result = property.validator(element);

        if (typeof result === 'string' || result === false) {
          throw new Error(result ? `${keyPath}: ${result}` : `${keyPath} is unacceptable.`);
        }

      }
      catch (error) {
        throw new Error(error.message ? `${keyPath}: ${error.message}` : `${keyPath} is unacceptable.`)
      }

    }

  }


  if (property.variants) {

    if (!( typeof element === 'object' && !Array.isArray(element) && !!element || ((element === undefined || element === null) && !property.required) )) {
      throw new Error(`${keyPath} is not variated object`);
    }

    if (element) {
      for (const variant in property.variants) {
        validateElement(document, element[variant], { ...property, ...property.variants[variant], variants: undefined }, `${keyPath}.${variant}`);
      }
    }

  }
  else if (property.array) {

    if (!( typeof element === 'object' && Array.isArray(element) && !!element || (element === undefined && !property.required) )) {
      throw new Error(`${keyPath} is not array`);
    }

    for (const subindex in element ?? []) {
      validateElement(document, element[subindex], { ...property, array: false }, `${keyPath}.${subindex}`);
    }

  }
  else if (property.type === 'boolean') {
    if (!( element === true || element === false || (element === undefined && !property.required) )) {
      throw new Error(`${keyPath} is not boolean`);
    }
  }
  else if (property.type === 'number') {
    if (!( element >= 0 || element < 0 || (element === undefined && !property.required) )) {
      throw new Error(`${keyPath} is not number`);
    }
  }
  else if (property.type === 'string') {
    if (!( typeof element === 'string' && element !== '' || (element === undefined && !property.required) || (element === '' && !property.required))) {
      throw new Error(`${keyPath} is not string`);
    }
  }
  else if (property.type === 'object') {
    if (!( typeof element === 'object' && !Array.isArray(element) && !!element || (element === undefined && !property.required) )) {
      throw new Error(`${keyPath} is not object`);
    }
  }
  else if (property.type === 'series') {
    if (element === undefined && !property.required) return;

    if (typeof element !== 'object' || !Array.isArray(element)) {
      throw new Error(`${keyPath} is not an array`);
    }

    if (property.required && !( element.length > 0 )) {
      throw new Error(`${keyPath} must be filled array`);
    }

    for (const index in element) {
      validateDocument(element[index], property.seriesSchema!, `${keyPath}.${index}`);
    }

  }
  else {
    throw new Error(`${property.type} validation for ${keyPath} is not defined.`);
  }

}

export function validateDocument<T, TF>(document: Record<keyof T, unknown>, properties: IResourceProperties<T, TF>, keyPath: string, optional = false): void {

  if (!( typeof document === 'object' && !Array.isArray(document) && !!document || (document === undefined && optional) )) {
    throw new Error(`${keyPath} is not an object`);
  }

  for (const key in properties) {
    validateElement(document, document[key], properties[key as keyof T], `${keyPath}.${key}`)
  }

}

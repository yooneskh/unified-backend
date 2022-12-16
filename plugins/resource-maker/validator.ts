import { IResourceBase, IResourceProperties } from './model.d.ts';
import { HandleableError } from '../error/handleable-error.ts';
import { validateElement } from './validator-utilities.ts';
import { ResourceController } from './controller.ts';


type IResourceValidationFunction<T, TF extends IResourceBase> = (it: T, controller?: ResourceController<T, TF>) => boolean | string | undefined | Promise<boolean | string | undefined>;

export type IResourceValidation<T, TF extends IResourceBase> = {
  [property in keyof T]?: IResourceValidationFunction<T, TF>[];
}

export class ResourceValidationError extends HandleableError {
  public code = 1200;
  public httpStatus = 400;
}


export class ResourceValidator<T, TF extends IResourceBase> {

  constructor(private name: string, private properties: IResourceProperties<T, TF>, private controller?: ResourceController<T, TF>) {
    this.initializeWithProperties();
  }

  private initializeWithProperties() {
    for (const key in this.properties) {
      const property = this.properties[key];

      this.addValidations({
        // deno-lint-ignore no-explicit-any
        [key as any]: [
          (it: T) => {
            validateElement(it, it[key], property, key);
            return true;
          }
        ]
      });

    }
  }

  public setController(controller: ResourceController<T, TF>) {
    this.controller = controller;
  }


  private validations: IResourceValidation<T, TF> = {};

  public addValidations(validations: IResourceValidation<T, TF>) {
    for (const property in validations) {
      if (property in this.validations) {
        this.validations[property] = [
          ...this.validations[property as keyof T]!,
          ...validations[property as keyof T]!
        ];
      }
      else {
        this.validations[property] = validations[property];
      }
    }
  }

  public async validate(document: T) {

    const errors: { property: string, error: string }[] = [];
    const frozenDocument = Object.freeze(document) as T;

    for (const property in this.validations) {
      for (const validator of this.validations[property]! || []) {
        try {

          const validationResult = await validator(frozenDocument, this.controller);
          if (validationResult !== false && typeof validationResult !== 'string') continue;

          errors.push({
            property,
            error: typeof validationResult === 'string' ? validationResult : `${property} is incorrect`
          });
          break;

        }
        catch (error: unknown) {

          errors.push({
            property,
            // deno-lint-ignore no-explicit-any
            error: (error as any).responseMessage || (error as any).message || String(error)
          });
          break;

        }
      }
    }

    if (errors.length === 0) return;

    throw new ResourceValidationError(
      `${this.name} validation errors: ${errors.map(it => it.error).join(' - ')}`,
      'There was a problem in your request data.',
      {},
      {
        validations: errors
      }
    );

  }

}

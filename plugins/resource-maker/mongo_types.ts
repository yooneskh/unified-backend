// deno-lint-ignore-file no-explicit-any

import { ObjectId } from '../../deps.ts';


type Document = Record<string, any>;


export type InferIdType<TSchema> = TSchema extends { _id: infer IdType }
  ?
    Record<any, never> extends IdType
    ? never
    : IdType
  : TSchema extends { _id?: infer IdType }
  ?
    unknown extends IdType
    ? ObjectId
    : IdType
  : ObjectId;


export type WithId<TSchema> = EnhancedOmit<TSchema, '_id'> & { _id: InferIdType<TSchema> };

export type EnhancedOmit<TRecordOrUnion, KeyUnion> = string extends keyof TRecordOrUnion
  ? TRecordOrUnion
  : TRecordOrUnion extends any
  ? Pick<TRecordOrUnion, Exclude<keyof TRecordOrUnion, KeyUnion>>
  : never;


export type Filter<TSchema> =
  | Partial<TSchema>
  | ({
      [Property in Join<NestedPaths<WithId<TSchema>>, '.'>]?: Condition<
        PropertyType<WithId<TSchema>, Property>
      >;
    } & RootFilterOperators<WithId<TSchema>>)
  | Record<string, any>;

export type Condition<T> = AlternativeType<T> | FilterOperators<AlternativeType<T>>;

export type AlternativeType<T> = T extends ReadonlyArray<infer U>
  ? T | RegExpOrString<U>
  : RegExpOrString<T>;

export type RegExpOrString<T> = T extends string ? RegExp | RegExp | T : T;


export interface RootFilterOperators<TSchema> {
  $and?: Filter<TSchema>[];
  $nor?: Filter<TSchema>[];
  $or?: Filter<TSchema>[];
  $text?: {
    $search: string;
    $language?: string;
    $caseSensitive?: boolean;
    $diacriticSensitive?: boolean;
  };
  $where?: string | ((this: TSchema) => boolean);
}

export type NonObjectIdLikeDocument = {
  [key in keyof ObjectId]?: never;
};


export interface FilterOperators<TValue> extends NonObjectIdLikeDocument {

  $eq?: TValue;
  $gt?: TValue;
  $gte?: TValue;
  $in?: ReadonlyArray<TValue>;
  $lt?: TValue;
  $lte?: TValue;
  $ne?: TValue;
  $nin?: ReadonlyArray<TValue>;

  $not?: TValue extends string ? FilterOperators<TValue> | RegExp : FilterOperators<TValue>;

  $exists?: boolean;
  $type?: BSONType | BSONTypeAlias;

  $expr?: Record<string, any>;
  $jsonSchema?: Record<string, any>;
  $mod?: TValue extends number ? [number, number] : never;
  $regex?: TValue extends string ? RegExp | RegExp | string : never;
  $options?: TValue extends string ? string : never;

  $geoIntersects?: { $geometry: Document };
  $geoWithin?: Document;
  $near?: Document;
  $nearSphere?: Document;
  $maxDistance?: number;

  $all?: ReadonlyArray<any>;
  $elemMatch?: Document;
  $size?: TValue extends ReadonlyArray<any> ? number : never;

  $bitsAllClear?: BitwiseFilter;
  $bitsAllSet?: BitwiseFilter;
  $bitsAnyClear?: BitwiseFilter;
  $bitsAnySet?: BitwiseFilter;
  $rand?: Record<string, never>;

}

export type BitwiseFilter = number | ReadonlyArray<number>;

export const BSONType = Object.freeze({
  double: 1,
  string: 2,
  object: 3,
  array: 4,
  binData: 5,
  undefined: 6,
  objectId: 7,
  bool: 8,
  date: 9,
  null: 10,
  regex: 11,
  dbPointer: 12,
  javascript: 13,
  symbol: 14,
  javascriptWithScope: 15,
  int: 16,
  timestamp: 17,
  long: 18,
  decimal: 19,
  minKey: -1,
  maxKey: 127
} as const);

export type BSONType = typeof BSONType[keyof typeof BSONType];
export type BSONTypeAlias = keyof typeof BSONType;


export type KeysOfAType<TSchema, Type> = {
  [key in keyof TSchema]: NonNullable<TSchema[key]> extends Type ? key : never;
}[keyof TSchema];


export type Join<T extends unknown[], D extends string> = T extends []
  ? ''
  : T extends [string | number]
  ? `${T[0]}`
  : T extends [string | number, ...infer R]
  ? `${T[0]}${D}${Join<R, D>}`
  : string;


export type PropertyType<Type, Property extends string> = string extends Property
  ? unknown
  : Property extends keyof Type
  ? Type[Property]
  : Property extends `${number}`
  ? Type extends ReadonlyArray<infer ArrayType>
    ? ArrayType
    : unknown
  : Property extends `${infer Key}.${infer Rest}`
  ? Key extends `${number}`
    ? Type extends ReadonlyArray<infer ArrayType>
      ? PropertyType<ArrayType, Rest>
      : unknown
    : Key extends keyof Type
    ? Type[Key] extends Map<string, infer MapType>
      ? MapType
      : PropertyType<Type[Key], Rest>
    : unknown
  : unknown;


export type NestedPaths<Type> = Type extends
  | string
  | number
  | boolean
  | Date
  | RegExp
  | Uint8Array
  | ((...args: any[]) => any)
  | { _bsontype: string }
  ? []
  : Type extends ReadonlyArray<infer ArrayType>
  ? [] | [number, ...NestedPaths<ArrayType>]
  : Type extends Map<string, any>
  ? [string]
  : Type extends Document
  ? {
      [Key in Extract<keyof Type, string>]: Type[Key] extends Type
        ? [Key]
        : Type extends Type[Key]
        ? [Key]
        : Type[Key] extends ReadonlyArray<infer ArrayType>
        ? Type extends ArrayType
          ? [Key]
          : ArrayType extends Type
          ? [Key]
          : [Key, ...NestedPaths<Type[Key]>]
        : [Key, ...NestedPaths<Type[Key]>] | [Key];
    }[Extract<keyof Type, string>]
  : [];


export type NestedPathsOfType<TSchema, Type> = KeysOfAType<
  {
    [Property in Join<NestedPaths<TSchema>, '.'>]: PropertyType<TSchema, Property>;
  },
  Type
>;
import { Either } from 'fp-ts/lib/Either';
import { Predicate } from 'fp-ts/lib/function';
declare global  {
    interface Array<T> {
        _A: T;
    }
}
export declare type mixed = object | number | string | boolean | symbol | undefined | null;
export interface ContextEntry {
    readonly key: string;
    readonly type: Decoder<any, any>;
}
export declare type Context = Array<ContextEntry>;
export interface ValidationError {
    readonly value: mixed;
    readonly context: Context;
}
export declare type Errors = Array<ValidationError>;
export declare type Validation<A> = Either<Errors, A>;
export declare type Is<A> = (v: mixed) => v is A;
export declare type Validate<S, A> = (s: S, context: Context) => Validation<A>;
export declare type Serialize<S, A> = (a: A) => S;
export declare type Any = Type<mixed, any>;
export declare type TypeOf<RT extends Type<any, any>> = RT['_A'];
export declare type InputOf<RT extends Type<any, any>> = RT['_S'];
export interface Decoder<S, A> {
    readonly name: string;
    readonly validate: Validate<S, A>;
}
export interface Encoder<S, A> {
    readonly serialize: Serialize<S, A>;
}
/**
 * Laws:
 * 1. validate(x).fold(() => x, serialize) = x
 * 2. validate(serialize(x)) = Right(x)
 */
export declare class Type<S, A> implements Decoder<S, A>, Encoder<S, A> {
    readonly name: string;
    readonly is: Is<A>;
    readonly validate: Validate<S, A>;
    readonly serialize: Serialize<S, A>;
    readonly '_A': A;
    readonly '_S': S;
    constructor(name: string, is: Is<A>, validate: Validate<S, A>, serialize: Serialize<S, A>);
    pipe<B>(ab: Type<A, B>, name?: string): Type<S, B>;
    asDecoder(): Decoder<S, A>;
    asEncoder(): Encoder<S, A>;
}
export declare const identity: <A>(a: A) => A;
export declare const getFunctionName: (f: Function) => string;
export declare const getContextEntry: (key: string, type: Decoder<any, any>) => ContextEntry;
export declare const getValidationError: (value: mixed, context: ContextEntry[]) => ValidationError;
export declare const getDefaultContext: (type: Decoder<any, any>) => ContextEntry[];
export declare const appendContext: (c: ContextEntry[], key: string, type: Decoder<any, any>) => ContextEntry[];
export declare const failures: <T>(errors: ValidationError[]) => Either<ValidationError[], T>;
export declare const failure: <T>(value: mixed, context: ContextEntry[]) => Either<ValidationError[], T>;
export declare const success: <T>(value: T) => Either<ValidationError[], T>;
export declare const validate: <S, A>(value: S, type: Decoder<S, A>) => Either<ValidationError[], A>;
export declare class NullType extends Type<mixed, null> {
    readonly _tag: 'NullType';
    constructor();
}
/** @alias `null` */
export declare const nullType: NullType;
export declare class UndefinedType extends Type<mixed, undefined> {
    readonly _tag: 'UndefinedType';
    constructor();
}
declare const undefinedType: UndefinedType;
export declare class AnyType extends Type<mixed, any> {
    readonly _tag: 'AnyType';
    constructor();
}
export declare const any: AnyType;
export declare class NeverType extends Type<mixed, never> {
    readonly _tag: 'NeverType';
    constructor();
}
export declare const never: NeverType;
export declare class StringType extends Type<mixed, string> {
    readonly _tag: 'StringType';
    constructor();
}
export declare const string: StringType;
export declare class NumberType extends Type<mixed, number> {
    readonly _tag: 'NumberType';
    constructor();
}
export declare const number: NumberType;
export declare class BooleanType extends Type<mixed, boolean> {
    readonly _tag: 'BooleanType';
    constructor();
}
export declare const boolean: BooleanType;
export declare class AnyArrayType extends Type<mixed, Array<mixed>> {
    readonly _tag: 'AnyArrayType';
    constructor();
}
declare const arrayType: AnyArrayType;
export declare class AnyDictionaryType extends Type<mixed, {
    [key: string]: mixed;
}> {
    readonly _tag: 'AnyDictionaryType';
    constructor();
}
export declare const Dictionary: AnyDictionaryType;
export declare class ObjectType extends Type<mixed, object> {
    readonly _tag: 'ObjectType';
    constructor();
}
export declare const object: ObjectType;
export declare class FunctionType extends Type<mixed, Function> {
    readonly _tag: 'FunctionType';
    constructor();
}
export declare const Function: FunctionType;
export declare class RefinementType<RT extends Type<any, any>, S, A> extends Type<S, A> {
    readonly type: RT;
    readonly predicate: Predicate<A>;
    readonly _tag: 'RefinementType';
    constructor(name: string, is: RefinementType<RT, S, A>['is'], validate: RefinementType<RT, S, A>['validate'], serialize: RefinementType<RT, S, A>['serialize'], type: RT, predicate: Predicate<A>);
}
export declare const refinement: <RT extends Type<any, any>>(type: RT, predicate: Predicate<RT["_A"]>, name?: string) => RefinementType<RT, RT["_S"], RT["_A"]>;
export declare const Integer: RefinementType<NumberType, mixed, number>;
export declare class LiteralType<V extends string | number | boolean> extends Type<mixed, V> {
    readonly value: V;
    readonly _tag: 'LiteralType';
    constructor(name: string, is: LiteralType<V>['is'], validate: LiteralType<V>['validate'], serialize: LiteralType<V>['serialize'], value: V);
}
export declare const literal: <V extends string | number | boolean>(value: V, name?: string) => LiteralType<V>;
export declare class KeyofType<D extends {
    [key: string]: any;
}> extends Type<mixed, keyof D> {
    readonly keys: D;
    readonly _tag: 'KeyofType';
    constructor(name: string, is: KeyofType<D>['is'], validate: KeyofType<D>['validate'], serialize: KeyofType<D>['serialize'], keys: D);
}
export declare const keyof: <D extends {
    [key: string]: any;
}>(keys: D, name?: string) => KeyofType<D>;
export declare class RecursiveType<RT extends Any, A> extends Type<mixed, A> {
    readonly _tag: 'RecursiveType';
    readonly 'type': RT;
    constructor(name: string, is: RecursiveType<RT, A>['is'], validate: RecursiveType<RT, A>['validate'], serialize: RecursiveType<RT, A>['serialize']);
}
export declare const recursion: <A, RT extends Type<mixed, any> = Type<mixed, any>>(name: string, definition: (self: RT) => RT) => RecursiveType<RT, A>;
export declare class ArrayType<RT extends Any, A> extends Type<mixed, A> {
    readonly type: RT;
    readonly _tag: 'ArrayType';
    constructor(name: string, is: ArrayType<RT, A>['is'], validate: ArrayType<RT, A>['validate'], serialize: ArrayType<RT, A>['serialize'], type: RT);
}
export declare const array: <RT extends Type<mixed, any>>(type: RT, name?: string) => ArrayType<RT, RT["_A"][]>;
export declare type Props = {
    [key: string]: Any;
};
export declare type InterfaceOf<P extends Props> = {
    [K in keyof P]: TypeOf<P[K]>;
};
export declare class InterfaceType<P extends Props, A> extends Type<mixed, A> {
    readonly props: P;
    readonly _tag: 'InterfaceType';
    constructor(name: string, is: InterfaceType<P, A>['is'], validate: InterfaceType<P, A>['validate'], serialize: InterfaceType<P, A>['serialize'], props: P);
}
/** @alias `interface` */
export declare const type: <P extends Props>(props: P, name?: string) => InterfaceType<P, InterfaceOf<P>>;
export declare type PartialOf<P extends Props> = {
    [K in keyof P]?: TypeOf<P[K]>;
};
export declare class PartialType<P extends Props, A> extends Type<mixed, A> {
    readonly props: P;
    readonly _tag: 'PartialType';
    constructor(name: string, is: PartialType<P, A>['is'], validate: PartialType<P, A>['validate'], serialize: PartialType<P, A>['serialize'], props: P);
}
export declare const partial: <P extends Props>(props: P, name?: string) => PartialType<P, PartialOf<P>>;
export declare class DictionaryType<D extends Any, C extends Any, A> extends Type<mixed, A> {
    readonly domain: D;
    readonly codomain: C;
    readonly _tag: 'DictionaryType';
    constructor(name: string, is: DictionaryType<D, C, A>['is'], validate: DictionaryType<D, C, A>['validate'], serialize: DictionaryType<D, C, A>['serialize'], domain: D, codomain: C);
}
export declare const dictionary: <D extends Type<mixed, any>, C extends Type<mixed, any>>(domain: D, codomain: C, name?: string) => DictionaryType<D, C, {
    [K in D["_A"]]: C["_A"];
}>;
export declare class UnionType<RTS extends Array<Any>, A> extends Type<mixed, A> {
    readonly types: RTS;
    readonly _tag: 'UnionType';
    constructor(name: string, is: UnionType<RTS, A>['is'], validate: UnionType<RTS, A>['validate'], serialize: UnionType<RTS, A>['serialize'], types: RTS);
}
export declare const union: <RTS extends Type<mixed, any>[]>(types: RTS, name?: string) => UnionType<RTS, RTS["_A"]["_A"]>;
export declare class IntersectionType<RTS extends Array<Any>, A> extends Type<mixed, A> {
    readonly types: RTS;
    readonly _tag: 'IntersectionType';
    constructor(name: string, is: Is<A>, validate: Validate<mixed, A>, serialize: Serialize<mixed, A>, types: RTS);
}
export declare function intersection<A extends Any, B extends Any, C extends Any, D extends Any, E extends Any>(types: [A, B, C, D, E], name?: string): IntersectionType<[A, B, C, D, E], TypeOf<A> & TypeOf<B> & TypeOf<C> & TypeOf<D> & TypeOf<E>>;
export declare function intersection<A extends Any, B extends Any, C extends Any, D extends Any>(types: [A, B, C, D], name?: string): IntersectionType<[A, B, C, D], TypeOf<A> & TypeOf<B> & TypeOf<C> & TypeOf<D>>;
export declare function intersection<A extends Any, B extends Any, C extends Any>(types: [A, B, C], name?: string): IntersectionType<[A, B, C], TypeOf<A> & TypeOf<B> & TypeOf<C>>;
export declare function intersection<A extends Any, B extends Any>(types: [A, B], name?: string): IntersectionType<[A, B], TypeOf<A> & TypeOf<B>>;
export declare function intersection<A extends Any>(types: [A], name?: string): IntersectionType<[A], TypeOf<A>>;
export declare class TupleType<RTS extends Array<Any>, A> extends Type<mixed, A> {
    readonly types: RTS;
    readonly _tag: 'TupleType';
    constructor(name: string, is: Is<A>, validate: Validate<mixed, A>, serialize: Serialize<mixed, A>, types: RTS);
}
export declare function tuple<A extends Any, B extends Any, C extends Any, D extends Any, E extends Any>(types: [A, B, C, D, E], name?: string): TupleType<[A, B, C, D, E], [TypeOf<A>, TypeOf<B>, TypeOf<C>, TypeOf<D>, TypeOf<E>]>;
export declare function tuple<A extends Any, B extends Any, C extends Any, D extends Any>(types: [A, B, C, D], name?: string): TupleType<[A, B, C, D], [TypeOf<A>, TypeOf<B>, TypeOf<C>, TypeOf<D>]>;
export declare function tuple<A extends Any, B extends Any, C extends Any>(types: [A, B, C], name?: string): TupleType<[A, B, C], [TypeOf<A>, TypeOf<B>, TypeOf<C>]>;
export declare function tuple<A extends Any, B extends Any>(types: [A, B], name?: string): TupleType<[A, B], [TypeOf<A>, TypeOf<B>]>;
export declare function tuple<A extends Any>(types: [A], name?: string): TupleType<[A], [TypeOf<A>]>;
export declare class ReadonlyType<RT extends Any, A> extends Type<mixed, A> {
    readonly type: RT;
    readonly _tag: 'ReadonlyType';
    constructor(name: string, is: ReadonlyType<RT, A>['is'], validate: ReadonlyType<RT, A>['validate'], serialize: ReadonlyType<RT, A>['serialize'], type: RT);
}
export declare const readonly: <RT extends Type<mixed, any>>(type: RT, name?: string) => ReadonlyType<RT, Readonly<RT["_A"]>>;
export declare class ReadonlyArrayType<RT extends Any, A> extends Type<mixed, A> {
    readonly type: RT;
    readonly _tag: 'ReadonlyArrayType';
    constructor(name: string, is: ReadonlyArrayType<RT, A>['is'], validate: ReadonlyArrayType<RT, A>['validate'], serialize: ReadonlyArrayType<RT, A>['serialize'], type: RT);
}
export declare const readonlyArray: <RT extends Type<mixed, any>>(type: RT, name?: string) => ReadonlyArrayType<RT, ReadonlyArray<RT["_A"]>>;
export declare class StrictType<P extends Props, A> extends Type<mixed, A> {
    readonly props: P;
    readonly _tag: 'StrictType';
    constructor(name: string, is: StrictType<P, A>['is'], validate: StrictType<P, A>['validate'], serialize: StrictType<P, A>['serialize'], props: P);
}
/** Specifies that only the given interface properties are allowed */
export declare const strict: <P extends Props>(props: P, name?: string) => StrictType<P, InterfaceOf<P>>;
export { nullType as null, undefinedType as undefined, arrayType as Array, type as interface };

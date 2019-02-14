import {clone} from "../clone";

/**
 * 代表可选值(T | null)
 * @see Haskell 的 Maybe、Scala的Optional
 * @note 这是一个 Monad
 */
export class Maybe<T> {
    readonly value: T | null;

    constructor(value: T | null | undefined | Maybe<T>) {
        // I hate the fact that we have two values which means "no value"
        if (value === undefined) {
            this.value = null;
        } else if (value instanceof Maybe) {
            this.value = clone(value.value);
        } else {
            this.value = value;
        }
    }

    // make it a Functor!
    public map<U>(func: (value: T) => U): Maybe<U> {
        if (this.value === null) {
            return new Maybe<U>(null);
        }
        return new Maybe(func(this.value));
    }

    // make it a Monad!
    public flatMap<U>(func: (value: T) => Maybe<U>): Maybe<U> {
        if (this.value === null) {
            return new Maybe<U>(null);
        }
        return func(this.value);
    }

    // make it an Applicative!
    // P.S. I don't really know how to write type for this
    // 应该限制 T 为 (param: T) => U
    // 见下point-free版本的类型签名
    public apply(param: Maybe<any>): Maybe<any> {
        return param.map(this.value as any);
    }

    get isNull(): boolean {
        return this.value === null;
    }
}

// point-free style
export function map<T, U>(maybe: Maybe<T>, func: (value: T) => U): Maybe<U> {
    return maybe.map(func);
}

export function apply<T, U>(func: Maybe<(param: T) => U>, value: Maybe<T>): Maybe<U> {
    return func.apply(value) as any as Maybe<U>;
}

export function flatMap<T, U>(maybe: Maybe<T>, func: (value: T) => Maybe<U>): Maybe<U> {
    return maybe.flatMap(func);
}

export function just<T>(value: T | null | undefined): Maybe<T> {
    return new Maybe<T>(value);
}

// some functions use Maybe
export function find<T>(array: Array<T>, pred: (value: T) => boolean): Maybe<T> {
    return new Maybe(array.find(pred));
}

export function findIndex<T>(array: Array<T>, pred: (value: T) => boolean): Maybe<number> {
    for (let i = 0; i < array.length; ++i) {
        if (pred(array[i])) {
            return new Maybe(i);
        }
    }
    return new Maybe<number>(null);
}

export function get<K, V>(map: Map<K, V>, key: K): Maybe<V> {
    return just(map.get(key));
}
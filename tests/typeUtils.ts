export type ReplaceKey<T, TKey extends keyof T, TReplace> = Omit<T, TKey> & {[key in TKey]: TReplace};
export type Combine<T, TOtherKey extends string, TOther> = T & {[key in TOtherKey]: TOther};

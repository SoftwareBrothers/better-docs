/**
 * Example of union type definition
 */
type SomeCombinedType = string | number | 'Specific string' | SomeOtherType;


/**
 * Example of simple type definition
 */
type SomeOtherType = boolean;

/**
 * Example of generic type definition with T as parameter
 */
type SomeGenericType<T> = T | SomeOtherGenericType<T> | { property: T, other: string }

/**
 * Example of generic type definition with T as parameter
 */
type SomeOtherGenericType<T> = { children: T[] }
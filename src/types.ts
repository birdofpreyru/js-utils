// Misc TypeScript-specific utilities.

/** The most permissive object key type. */
export type ObjectKey = string | number | symbol;

/** Asserts given object is empty, both compile- and run-time. */
export function assertEmptyObject(object: Record<ObjectKey, never>): void {
  if (Object.keys(object).length) throw Error('The object is not empty');
}

/**
 * Validates compile-time that the type T extends Base, and returns T.
 *
 * BEWARE: In the case Base has some optional fields missing in T, T still
 * extends Base (as "extends" means T is assignable to Base)! The Implements
 * util below also checks that T has all optional fields defined in Base.
 */
export type Extends<Base, T extends Base> = T;

/**
 * Validates compile-time that the type T extends (is assignable to) the type
 * Base, and also that it has defined all (if any) optional fields defined in
 * the Base. Returns T if the validation passes.
 */
export type Implements<
  Base,
  T extends Required<T> extends Required<Base> ? Base : Required<Base>,
> = T;

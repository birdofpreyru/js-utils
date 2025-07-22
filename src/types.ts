// Misc TypeScript-specific utilities.

/** The most permissive object key type. */
export type ObjectKey = string | number | symbol;

/** Asserts given object is empty, both compile- and run-time. */
export function assertEmptyObject(object: Record<ObjectKey, never>): void {
  if (Object.keys(object).length) throw Error('The object is not empty');
}

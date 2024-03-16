/**
 * Picks specified properties from an object.
 *
 * @param obj The object from which to pick properties.
 * @param keys The keys of properties to pick.
 * @returns A new object containing only the picked properties.
 */

const pick = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[],
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

export default pick;

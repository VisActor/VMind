import { isArray, isObject, isValid, merge } from '@visactor/vutils';

export function set(object: any, path: string, value: any) {
  return object == null ? object : baseSet(object, path, value);
}

export function deleteByPath(object: any, path: string) {
  return object == null ? object : baseDelete(object, path);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(path: string, object: any) {
  if (object[path]) {
    return [path];
  }
  const arr: string[] = [];

  path.split('.').forEach(entry => {
    const res = /\[(\d)\]/g.exec(entry);

    if (res) {
      arr.push(entry.replace(res[0], ''));
      arr.push(res[1]);
    } else {
      arr.push(entry);
    }
  });

  return arr;
}

function isIndex(key: string) {
  return /\d/.exec(key);
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} pathString The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object: any, pathString: string, value: any) {
  if (!isObject(object)) {
    return object;
  }
  const path = castPath(pathString, object);

  let index = -1;
  const length = path.length;
  const lastIndex = length - 1;
  let nested: any = object;

  while (nested != null && ++index < length) {
    const key = path[index];
    let newValue = value;

    if (index !== lastIndex) {
      const objValue = (nested as any)[key];

      newValue = isValid(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
    }

    if (isValid(nested[key])) {
      if ('object' !== typeof newValue) {
        merge(nested, { [key]: newValue });
      } else {
        merge(nested[key], newValue);
      }
    } else {
      nested[key] = newValue;
    }
    nested = nested[key];
  }
  return object;
}

/**
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} pathString The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseDelete(object: any, pathString: string) {
  if (!isObject(object)) {
    return object;
  }
  const path = castPath(pathString, object);

  let index = -1;
  const length = path.length;
  const lastIndex = length - 1;
  let nested: any = object;

  while (nested != null && ++index < length) {
    const key = path[index];

    if (key in nested) {
      if (index === lastIndex) {
        if (isArray(nested)) {
          nested.splice(Number(key), 1);
        } else {
          delete nested[key];
        }
      } else {
        nested = nested[key];
      }
    }
  }
  return object;
}

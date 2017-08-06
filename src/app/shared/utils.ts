import { PayloadCreator, CreateAction, IMetatadata, IAction } from './interfaces';

/**
 * Noop
 */
export const noop = () => { };

/**
 * Identity
 * Returns the first argument received.
 *
 * @param obj the value to be returned.
 */
export const identity = (obj: any) => {
  return obj;
}

/**
 * Is Function
 * Check if object provided is function.
 *
 * @param obj - test object provided is function.
 */
export function isFunction(obj: any): boolean {
  if (isUndefined(obj))
    return false;
  return typeof obj === 'function';
}

/**
 * Is String
 * Inspect value provided testing if is string.
 * @param obj the value to be tested.
 */
export function isString(obj: any): boolean {
  if (isUndefined(obj))
    return false;
  return typeof obj === 'string' || obj instanceof String;
}

/**
 * Is Empty
 * Test if value provided is empty.
 *
 * @param obj value to be inspected.
 */
export function isEmpty(obj: any): boolean {
  return obj === undefined ||
    obj === null ||
    obj === {} ||
    keys(obj).length > 0 ||
    obj === '';
}

/**
 * Is Array
 * Check if value is an array.
 *
 * @param obj the object to test as array.
 */
export function isArray(obj: any): boolean {
  if (Array.isArray)
    return Array.isArray(obj);
  return toString.call(obj) === '[object Array]';
}

/**
 * Is Boolean
 *
 * @param obj
 */
export function isBoolean(obj: any): boolean {
  if (isUndefined(obj))
    return false;
  return typeof obj === 'boolean';
}

/**
 * Is Null
 * Checks if value is null.
 *
 * @param obj the object to inspect for null.
 */
export function isNull(obj: any): boolean {
  return obj === null;
}

/**
 * Check if is not a number.
 * @param obj value to tests if not is a number.
 */
export function isNan(obj: any): boolean {
  if (isUndefined(obj))
    return true;
  return isNaN(obj);
}

/**
 * Is Object
 * Checks if value is an object.
 *
 * @param obj the object to inspect.
 */
export function isObject(obj: any): boolean {
  if (isUndefined(obj) || isNull(obj))
    return false;
  return typeof obj === 'object' || typeof obj === 'function';
}

/**
 * Is Error
 * Checks if value is an error.
 *
 * @param obj the value/object to be inspected.
 * @param inspect a key value to inspect in error object if exists.
 */
export function isError(obj: any, inspect?: string): boolean {
  if (isUndefined(obj) || isNull(obj))
    return false;
  const type = toString.call(obj).toLowerCase();

  if (inspect)
    return type === '[object error]' || type === '[object domexception]' || obj[inspect];
  return type === '[object error]' || type === '[object domexception]';
}

/**
 * Is Reg Expression
 * Tests if object is regular expression.
 */
export function isRegExp(obj: any): boolean {
  return (obj instanceof RegExp);
}

/**
 * Is Date
 * Parses value inspecting if is Date.
 *
 * @param obj the value to inspect/test if is Date.
 * @param parse when True parsing is allowed to parse/check if string is Date.
 */
export function isDate(obj: any, parse?: boolean): boolean {

  if (!parse)
    return obj instanceof Date;

  // If is string try to parse date.
  if (isString(obj) && parse) {

    // Ignore if only numbers string.
    if (/^[0-9]+$/.test(obj))
      return false;

    if (!/[0-9]/g)
      return false;

    // Ignore if no date or time delims.
    if (!/(\.|\/|-|:)/g.test(obj))
      return false;

    // Parse and ensure is number/epoch.
    return isNumber(tryParseDate(obj));

  }

  return false;
}

/**
 * Is Undefined
 * Tests if value is undefined.
 *
 * @param val the value to inspect
 */
export function isUndefined(val: any) {
  return (typeof val === 'undefined');
}

/**
 * Is Plain Object
 * Inspects value checking if is object literal.
 *
 * @param val the value to inspect
 */
export function isPlainObject(val: any) {
  if (isUndefined(val))
    return false;
  return val ? val.constructor === {}.constructor : false;
}

/**
 * Check if value provided is number.
 * @param obj the value to be tested.
 */
export function isNumber(obj: any): boolean {
  return !isNaN(parseFloat(obj)) && isFinite(obj);
}

/**
 * Is Instance
 * Tests if object is instanceof provided Type.
 *
 * @param obj the object to check.
 * @param Type the instance type to match.
 */
export function isInstance(obj: any, Type: any): boolean {
  return obj instanceof Type;
}

/**
 * Is Unique
 * Tests if the value is unique in the collection.
 *
 * @param obj the object to be inspected.
 * @param value the value to be matched.
 */
export function isUnique(arr: any[], value: any): boolean {

  return duplicates(arr, value, true) === 0;

}

/**
 * Is Equal
 * Tests if two values are equal.
 * Does not support "deep equal".
 *
 * @param value the value to be compared.
 * @param compare the comparer value.
 * @param loose when true == is used instead of ===.
 */
export function isEqual(value: any, compare: any, loose?: boolean): boolean {
  if (!loose)
    return value === compare;
  return value == compare;
}

/**
 * Duplicates
 * Counts the number of duplicates in an array.
 *
 * @param arr the array to check for duplicates.
 * @param value the value to match.
 * @param breakable when true allows breaking at first duplicate.
 */
export function duplicates(arr: any[], value: any, breakable?: boolean): number {

  let i = arr.length;
  let dupes = 0;

  while (i--) {
    if (breakable && dupes > 1)
      break;
    if (isEqual(arr[i], value))
      dupes += 1;
  }

  dupes -= 1;

  return dupes < 0 ? 0 : dupes;

}

/**
 * Contains
 * Tests if array contains value.
 *
 * @param arr the array to be inspected.
 * @param value the value to check if is contained in array.
 */
export function contains(arr: any[], value: any): boolean {
  arr = arr || [];
  return arr.filter((v) => {
    return isEqual(v, value);
  }).length > 0;
}

/**
 * Contains Any
 * Tests array check if contains value.
 *
 * @param arr the array to be inspected.
 * @param compare - array of values to compare.
 */
export function containsAny(arr: any[], compare: any[]): boolean {
  if (!isArray(arr) || !isArray(compare))
    return false;
  return compare.filter(c => {
    return contains(arr, c);
  }).length > 0;
}

/**
 * Keys
 * Takes an object then returns keys in array.
 *
 * @param obj the object to parse keys.
 */
export function keys(obj: any): string[] {
  if (!isPlainObject(obj))
    return [];
  return Object.keys(obj);
}

/**
 * Extend
 * Extends objects similar to Object.assign
 * with the exception that undefined values are ignored.
 *
 * @example
 * extend({ name: 'Bob', active: true }, { active: undefined })
 * results in:
 * { name: 'Bob', active: true }
 *
 * @param obj primary object.
 * @param args unlimited number of objects to extend from.
 */
export function extend<T>(obj: any, ...args: any[]): T {

  let deep = false;
  let target: any;

  // If deep is first set
  // deep property and grab
  // first element in args.
  if (isBoolean(obj)) {
    deep = obj;
    if (!args.length)
      return {} as T;
    obj = args.shift();
  }

  // if no result set to obj.
  !target ? target = obj : args.unshift(obj);

  // Rather than return the orig value
  // if not an object just return empty
  // object to prevent errors etc.
  if (!isObject(target))
    return {} as T;

  for (let i = 0, source: any; source = args[i]; i++) {

    // If not an object return.
    if (!isObject(source))
      return;

    for (let name in source) {
      if (source.hasOwnProperty(name)) {

        const to = target[name];
        const from = source[name];
        const _isPlainObject = isPlainObject(from);
        const _isArray = isArray(from);

        if (deep && (_isPlainObject || _isArray)) {
          let _clone: any;
          if (_isArray)
            _clone = to && isArray(to) ? to : [];
          else
            _clone = to && isPlainObject(to) ? to : {};
          target[name] = extend(deep, _clone, from);
        }
        else if (!isUndefined(from)) {
          target[name] = from;
        }

      }
    }

  }

  return target;
}

/**
 * Flatten
 * Takes multiple arrays and flattens to single array.
 * NOTE: this will NOT work for empty nested arrays
 * but will work for 90 plus % of cases.
 *
 * @param args rest param containing multiple arrays to flatten.
 */
export function flatten(args: any[]): any[] {
  return [].concat.apply([], args);
}

/**
 * Clone
 * Please use caution this is meant to
 * clone simple objects. It fits the
 * need. Use _.clone from lodash for
 * complete solution.
 *
 * @param obj object to be cloned.
 */
export function clone<T>(obj: any): T {
  return extend<T>(true, {}, obj);
}

/**
 * Shallow Clone
 * Clones object using JSON.
 *
 * @param obj the object to clone.
 */
export function shallowClone<T>(obj: any): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * First
 * Simple method to get first element just
 * a little less typing.
 *
 * @param arr the array to get first element from.
 */
export function first(arr: any[]): any {
  return arr[0];
}

/**
 * Last
 * Simple method to get last element.
 *
 * @param arr the array to get last element.
 */
export function last(arr: any[]): any {
  return arr[arr.length - 1];
}

/**
 * Match Index
 *
 * @param prop the property to match.
 */
export function matchIndex(prop) {
  const match = new RegExp('(.+)\\[([0-9]*)\\]', 'i').exec(prop);
  if (match && match.length === 3)
    return { name: match[1], index: match[2] };
  return false;
}

/**
 * Split
 * Splits a string at character.
 * Default possible chars to match: ['/', '.', ',', '|']
 *
 * @param str the string to be split.
 * @param char the character to split at.
 */
export function split(str: string | string[], char?: string): string[] {

  if (isArray(str))
    return str as string[];

  // default characters.
  const defChars = ['/', '.', ',', '|'];
  let arr;

  // if no char iterate defaults.
  if (!char) {
    while (!char && defChars.length) {
      const tmpChar = defChars.shift();
      const exp = new RegExp(tmpChar, 'g');
      if (exp.test(str as string))
        char = tmpChar;
    }
  }

  // Set the default arr.
  const tmp = str as string;
  arr = [str];

  // If char split.
  if (char)
    arr = tmp.split(char);

  // If empty remove first element.
  // this happens when splitting on
  // char and is first char in string.
  if (isEmpty(arr[0]))
    arr.shift();

  return arr;

}

/**
 * Del
 * Deletes keys in an object.
 *
 * @param obj the object whose keys should be deleted.
 * @param props the property keys that should be deleted.
 */
export function del(obj: any, key: string | string[]): any {

  if (arguments.length !== 2 || (!isArray(key) && !isString(key)))
    return obj;

  const props: string[] = split(key);
  const prop = props.shift();
  const match = matchIndex(prop);

  let next = obj[prop];

  if (match)
    next = obj[match.name][match.index];

  if (props.length > 0) {
    del(next, props);
  }

  else {
    if (match) {
      obj[match.name].splice(match.index, 1);
    }
    else {
      delete obj[prop];
    }

  }

  return obj;

}

/**
 * Get
 * Gets a property within the supplied object.
 *
 * @param obj the object to inspect.
 * @param prop
 */
export function get(obj: any, key: string | string[]) {

  if (arguments.length !== 2 || (!isArray(key) && !isString(key)))
    return obj;

  let _clone = clone(obj);
  const props: string[] = split(key);

  while (props.length && _clone) {

    const prop = props.shift();
    let match;

    match = matchIndex(prop);

    if (match) {

      if (_clone[match.name] !== undefined)
        _clone = _clone[match.name][match.index];

    }

    else {
      _clone = _clone[prop];

    }

  }

  return _clone;
}

/**
 * Set
 * Sets a value on an object using dot notation or url path.
 *
 * @param obj the object to set the value on.
 * @param key the property used for setting the value.
 * @param value the value used for updating the property.
 * @param dynamic when NOT false objects are dynamically created if required.
 */
export function set(obj: any, key: string | string[], value: any, dynamic?: boolean) {

  if (arguments.length !== 3 || (!isArray(key) && !isString(key)))
    return obj;

  const props: string[] = split(key);

  if (isUndefined(value) && dynamic !== false)
    value = {};

  const prop = props.shift();
  const match = matchIndex(prop);
  let next = obj[prop];

  if (isUndefined(next) && dynamic !== false)
    next = obj[prop] = {};

  if (match)
    next = obj[match.name][match.index];

  if (props.length > 0) {
    set(next, props, value);
  }

  else {
    if (match)
      obj[match.name][match.index] = value;
    else
      obj[prop] = value;

  }

  return obj;

}

/**
 * UUID
 * Generates a UUID.
 */
export function uuid() {

  let d = Date.now();

  // Use high perf timer if avail.
  if (typeof performance !== 'undefined' && isFunction(performance.now))
    d += performance.now();

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

}

/**
 * Pad Left
 * Pads a string on the left.
 *
 * @param str the string to be padded.
 * @param len the length to pad.
 * @param char the character to pad with or offset value to add.
 * @param offset an offset value to add.
 */
export function padLeft(str: string, len: number, char?: string | number, offset?: number): string {

  if (isNumber(char)) {
    offset = char as number;
    char = undefined;
  }

  char = char || ' ';
  let pad = '';
  while (len--) {
    pad += char;
  }
  if (offset)
    return padLeft('', offset, char) + pad + str;
  return pad + str;
}

/**
 * Pad Right
 * Pads a string to the right.
 *
 * @param str the string to be padded.
 * @param len the length to pad.
 * @param char the character to pad with or offset value to add.
 * @param offset an offset value to add.
 */
export function padRight(str: string, len: number, char?: string | number, offset?: number): string {

  if (isNumber(char)) {
    offset = char as number;
    char = undefined;
  }

  char = char || ' ';
  while (len--) {
    str += char;
  }
  if (offset)
    str += padRight('', offset, char);
  return str;
}

/**
 * Pad Values
 *
 * @param values the values to be padded.
 * @param dir the direction to pad.
 * @param char the character to pad with or offset value to add.
 * @param offset an offset value to add.
 */
export function padValues(values: string[], strategy?: string, char?: string | number, offset?: number): string[] {

  if (isNumber(char)) {
    offset = char as number;
    char = undefined;
  }

  // do nothing.
  if (strategy === 'none')
    return values;

  let len = 0;
  strategy = strategy || 'right';
  char = char || ' ';

  const func = strategy === 'right' ? padRight : padLeft;

  values.forEach((item) => {
    if (item.length > len)
      len = item.length;
  });

  if (offset) len += offset;

  values.forEach((item, i) => {
    if (item.length < len)
      values[i] = func(item, len - item.length, char);
  });

  return values;

}

/**
 * Get Type
 * Gets the type of an object.
 *
 * @param obj the object to get type from.
 * @param stringToDate when true parses strings to see if they are dates.
 * @param unknown the string name for unknown types.
 */
export function getType(obj: any, stringToDate?: boolean | string, unknown?: string): any {

  const type = typeof obj;

  if (isString(stringToDate)) {
    unknown = stringToDate as string;
    stringToDate = undefined;
  }

  if (type !== 'object' && type !== 'string')
    return type;

  else if (type === 'string' && stringToDate) {
    if (isDate(obj, true))
      return 'date';
    return type;
  }

  else if (isDate(obj))
    return 'date';

  else if (isRegExp(obj))
    return 'regexp';

  else if (isArray(obj))
    return 'array';

  else if (isPlainObject(obj))
    return 'object';

  else if (isError(obj))
    return 'error';

  else if (obj === null)
    return 'null';

  return unknown || 'unknown';

}

/**
 * Try Parse Date
 * Attempts to parse a date from a string.
 *
 * @param str the string to attempt parsing on.
 */
export function tryParseDate(str: string): string | number {
  try {
    const d = Date.parse(str);
    if ((d + '') !== 'Invalid Date' && !isNaN(d))
      return d;
    return str;
  } catch (ex) {
    return str;
  }
}


// Action Creator.
export const createAction = (type: string | number, fn?: PayloadCreator | IMetatadata, meta?: IMetatadata): CreateAction => {

  if (!isFunction(fn)) {
    meta = fn;
    fn = undefined;
  }

  fn = fn || identity;

  return (...args: any[]) => {

    const action: IAction = { type: type };
    const _first = first(args);

    if (isError(_first)) {
      action.payload = _first;
      action.error = true;
    }
    else {
      action.payload = (fn as Function)(...args);
    }

    if (meta)
      action.meta = meta;

    return action;

  }

}

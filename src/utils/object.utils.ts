export function onlyUnique(value: any, index: number, array: any[]) {
  return array.indexOf(value) === index;
}

export function unflatten(data: any): any {
  if (Object(data) !== data || Array.isArray(data)) {
    return data;
  }

  let result: any = {};
  let cur: any;
  let prop;
  let idx;
  let last
  let temp;

  for (const p in data) {
    cur = result;
    prop = '';
    last = 0;

    do {
      idx = p.indexOf(".", last);
      temp = p.substring(last, idx !== -1 ? idx : undefined);
      cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
      prop = temp;
      last = idx + 1;
    } while (idx >= 0);
    cur[prop] = data[p];
  }

  return result[''];
}

export function flatten(data: any): any {
  let result: any = {};

  function recurse(cur: any, prop: any) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (let i = 0, l = cur.length; i < l; i++) {
        recurse(cur[i], prop ? prop + "." + i : "" + i);

        if (l == 0) {
          result[prop] = [];
        }
      }
    } else {
      let isEmpty = true;

      for (const p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }

      if (isEmpty) {
        result[prop] = {};
      }
    }
  }

  recurse(data, '');

  return result;
}

export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

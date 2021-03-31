import CryptoJS from 'crypto-js';
import store from 'store';
import isString from 'lodash/isString';

const get = (key: string | any): any | undefined => {
  if (!isString(key)) return;
  return store.encryptGet(key);
};

const set = (key: any, data?: any | string | Record<string, any>) => {
  if (!isString(key)) return;
  return store.encryptSet(key, data);
};

const remove = (key: any): void => {
  if (!isString(key)) return;
  return store.remove(key);
};

const clear = (excludedKey?: string | string[]): void => {
  store.each((_, key) => {
    if (isNeedExcludeKey(key, excludedKey)) return;
    store.remove(key);
  });
};

function isNeedExcludeKey(key, excludedKey) {
  if (!excludedKey) return false;

  if (isString(excludedKey) && key === excludedKey) return true;

  if (Array.isArray(excludedKey) && excludedKey.includes(key)) return true;

  return false;
}

const init = (storeKey: string): void => {
  function cryptoPlugin() {
    return {
      encryptSet(_, key, data) {
        const encryptValue = CryptoJS.AES.encrypt(JSON.stringify(data), storeKey).toString();

        store.set(key, encryptValue);
      },
      encryptGet(_, key) {
        const encryptedValue = (this as any).get(key);

        if (!encryptedValue) return encryptedValue;

        const bytes = CryptoJS.AES.decrypt(encryptedValue, storeKey);

        const bytesString = bytes.toString(CryptoJS.enc.Utf8);

        try {
          return JSON.parse(bytesString);
        } catch {
          return bytesString;
        }
      },
    };
  }
  store.addPlugin(cryptoPlugin);
};

const sessionGet: any = key => {
  if (!isString(key)) return;

  const value = sessionStorage.getItem(key);

  if (!value) return;

  const bytes = CryptoJS.AES.decrypt(value, key);

  const bytesString = bytes.toString(CryptoJS.enc.Utf8);

  try {
    return JSON.parse(bytesString);
  } catch {
    return bytesString;
  }
};

const sessionSet = (key: any, data: any[] | string | Record<string, any>): void => {
  if (!isString(key) || !data) return;

  return sessionStorage.setItem(key, CryptoJS.AES.encrypt(JSON.stringify(data), key).toString());
};

const sessionRemove = (key: any): void => {
  if (!isString(key)) return;

  return sessionStorage.removeItem(key);
};

const sessionClear = (): void => sessionStorage.clear();

export default {
  get,
  set,
  remove,
  clear,
  init,
  sessionGet,
  sessionSet,
  sessionRemove,
  sessionClear,
};

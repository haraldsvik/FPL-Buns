import { IFplProfile } from "../handlers/profile";

type Cache = {
  data: { [key: string]: IFplProfile };
  // lastUpdated: Date;
};

let cache: Cache = {
  data: {},
  // lastUpdated: new Date(0)  // Initialize with a date far in the past
};

const MAX_CACHE_SIZE = 1000;

export const getFromMemoryCache = (key: string): IFplProfile | undefined => {
  // const today = new Date().setHours(0, 0, 0, 0);
  // const cacheDate = cache.lastUpdated.setHours(0, 0, 0, 0);

  // // If the cache was last updated on a previous day, treat as invalid
  // if (cacheDate < today) {
  //   cache.data = {};
  //   return undefined;
  // }

  return cache.data[key];
};

export const setToMemoryCache = (key: string, value: IFplProfile): void => {
  if (Object.keys(cache.data).length >= MAX_CACHE_SIZE) {
    cache.data = {};
  }

  cache.data[key] = value;
  // if(!cache.lastUpdated) cache.lastUpdated = new Date();
};

export const invalidateCache = (): void => {
  cache = {
    data: {},
    // lastUpdated: new Date(0)
  };
}

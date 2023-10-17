import { IFplProfile } from "../handlers/profile";

type Cache = {
  data: { [key: string]: IFplProfile };
};

let cache: Cache = {
  data: {},
};

const MAX_CACHE_SIZE = 10000;

export const getFromMemoryCache = (key: string): IFplProfile | undefined => {
  return cache.data[key];
};

export const setToMemoryCache = (key: string, value: IFplProfile): void => {
  if (Object.keys(cache.data).length >= MAX_CACHE_SIZE) {
    cache.data = {};
  }

  cache.data[key] = value;
};

export const getTopPlayers = (limit: number, offset: number): IFplProfile[] => {
  const playersArray = Object.values(cache.data);

  playersArray.sort((a, b) => b.summary_overall_points - a.summary_overall_points);

  return playersArray.slice(offset, offset + limit);
}

export const invalidateCache = (): void => {
  cache = {
    data: {}
  };
}

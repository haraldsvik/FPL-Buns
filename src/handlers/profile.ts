import { getFromMemoryCache, setToMemoryCache } from "../services/cacheService";
import { fetchFPL } from "../services/fplService";

const FPL_API_URL = 'https://fantasy.premierleague.com/api/';

export interface IFplProfile {
  summary_overall_points: number;
  summary_event_points: number;
  summary_overall_rank: number;
  id: number;
  fplName: string;
  teamName: string;
  country: string;
  countryCode: string;
}

export const fetchProfile = async (entry: string): Promise<IFplProfile> => {
  const cachedData = getFromMemoryCache(entry);

  if (cachedData && isFplProfile(cachedData)) {
    return cachedData;
  }

  try {
    const fplData = await fetchFPL(`${FPL_API_URL}/entry/${entry}/`);

    const profile = transformFplDataToProfile(fplData); 
    setToMemoryCache(entry, profile);

    return profile;

  } catch (error) {
    console.error(`Failed to fetch profile for entry ${entry}:`, error);

    throw new Error("Failed to fetch FPL profile data");
  }
};


const transformFplDataToProfile = (fplData: any): IFplProfile => {
  const {
    summary_overall_points,
    summary_event_points,
    summary_overall_rank,
    id,
    player_first_name,
    player_last_name,
    name,
    player_region_name,
    player_region_iso_code_long,
  } = fplData;

  return {
    summary_overall_points,
    summary_event_points,
    summary_overall_rank,
    id,
    fplName: `${player_first_name} ${player_last_name}`,
    teamName: name,
    country: player_region_name,
    countryCode: player_region_iso_code_long,
  };
};

const isFplProfile = (data: any): data is IFplProfile =>
  typeof data.summary_overall_points === 'number'
  && typeof data.fplName === 'string'
  && typeof data.teamName === 'string'
  && typeof data.country === 'string'
  && typeof data.countryCode === 'string'
  && typeof data.summary_event_points === 'number'
  && typeof data.summary_overall_rank === 'number'
  && typeof data.id === 'number';

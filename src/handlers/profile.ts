import { fetchFPL } from "../services/fplService";

interface IFplProfile {
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
  const fplData = await fetchFPL(`https://fantasy.premierleague.com/api/entry/${entry}/`);

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
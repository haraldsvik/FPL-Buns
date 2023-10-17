import { getTopPlayers } from "../services/cacheService";

export const calcLeaderboard = (limit: number, offset: number) => {
  try {
    const topPlayers = getTopPlayers(limit, offset);
    return topPlayers;
  } catch (error) {
    console.error("Leaderboard error", error);
    throw error;
  }
}
// @bun
// src/services/cacheService.ts
var cache = {
  data: {}
};
var MAX_CACHE_SIZE = 1e4;
var getFromMemoryCache = (key) => {
  return cache.data[key];
};
var setToMemoryCache = (key, value) => {
  if (Object.keys(cache.data).length >= MAX_CACHE_SIZE) {
    cache.data = {};
  }
  cache.data[key] = value;
};
var getTopPlayers = (limit, offset) => {
  const playersArray = Object.values(cache.data);
  playersArray.sort((a, b) => b.summary_overall_points - a.summary_overall_points);
  return playersArray.slice(offset, offset + limit);
};
var invalidateCache = () => {
  cache = {
    data: {}
  };
};

// src/handlers/leaderboard.ts
var calcLeaderboard = (limit, offset) => {
  try {
    const topPlayers = getTopPlayers(limit, offset);
    return topPlayers;
  } catch (error) {
    console.error("Leaderboard error", error);
    throw error;
  }
};

// src/services/fplService.ts
var fetchFPL = async (url) => {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "" } });
    if (!res.ok) {
      throw new Error("Failed fetching FPL data.");
    }
    return await res.json();
  } catch (error) {
    console.error("FPL error", error);
    throw error;
  }
};

// src/config/index.ts
var fplUrl = "https://fantasy.premierleague.com/api";

// src/handlers/profile.ts
var fetchProfile = async (entry) => {
  const cachedData = getFromMemoryCache(entry);
  if (cachedData && isFplProfile(cachedData)) {
    return cachedData;
  }
  try {
    const fplData = await fetchFPL(`${fplUrl}/entry/${entry}/`);
    const profile = transformFplDataToProfile(fplData);
    setToMemoryCache(entry, profile);
    return profile;
  } catch (error) {
    console.error(`Failed to fetch profile for entry ${entry}:`, error);
    throw new Error("Failed to fetch FPL profile data");
  }
};
var transformFplDataToProfile = ({
  summary_overall_points,
  summary_event_points,
  summary_overall_rank,
  id,
  player_first_name,
  player_last_name,
  name,
  player_region_name,
  player_region_iso_code_long
}) => ({
  summary_overall_points,
  summary_event_points,
  summary_overall_rank,
  id,
  fplName: `${player_first_name} ${player_last_name}`,
  teamName: name,
  country: player_region_name,
  countryCode: player_region_iso_code_long
});
var isFplProfile = (data) => typeof data.summary_overall_points === "number" && typeof data.fplName === "string" && typeof data.teamName === "string" && typeof data.country === "string" && typeof data.countryCode === "string" && typeof data.summary_event_points === "number" && typeof data.summary_overall_rank === "number" && typeof data.id === "number";

// src/api/routes/index.ts
var jsonResponse = (data, status = 200) => new Response(JSON.stringify(data), {
  headers: {
    "content-type": "application/json"
  },
  status
});
var errorResponse = (error, status = 500) => new Response(JSON.stringify({ msg: "Something went wrong", error }), {
  status,
  headers: {
    "content-type": "application/json"
  }
});
var routes = {
  "/": async () => jsonResponse({ msg: "Hello World!" }),
  "/fpl/profile": async (url) => {
    const query = new URLSearchParams(url.search);
    const entry = query.get("entry");
    if (!entry) {
      return jsonResponse({ msg: "Invalid entry" }, 400);
    }
    const data = await fetchProfile(entry);
    return jsonResponse(data);
  },
  "/fpl/leaderboard": async (url) => {
    const query = new URLSearchParams(url.search);
    const limitStr = query.get("limit");
    const offsetStr = query.get("offset");
    const limit = limitStr ? parseInt(limitStr) : 10;
    const offset = offsetStr ? parseInt(offsetStr) : 0;
    const data = calcLeaderboard(limit, offset);
    return jsonResponse(data);
  },
  "/fpl/invalidate": async () => {
    invalidateCache();
    return jsonResponse({ msg: "Cache invalidated" });
  }
};
var router = async (url) => {
  try {
    const routeHandler = routes[url.pathname];
    if (routeHandler) {
      return await routeHandler(url);
    }
    return jsonResponse({ msg: "404!" }, 404);
  } catch (err) {
    return errorResponse(err);
  }
};

// index.ts
var server = Bun.serve({
  port: Bun.env.PORT || 4001,
  async fetch(req) {
    const url = new URL(req.url);
    return router(url);
  },
  async error(err) {
    console.error(err);
    return errorResponse("Something went wrong :/", 500);
  }
});
console.log(`Listening on localhost:${server.port}`);

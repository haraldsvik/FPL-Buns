import { calcLeaderboard } from "../../handlers/leaderboard";
import { fetchProfile } from "../../handlers/profile";
import { invalidateCache } from "../../services/cacheService";


const jsonResponse = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
    },
    status
  });

export const errorResponse = (error: any, status = 500) =>
  new Response(JSON.stringify({ msg: "Something went wrong", error }),
    {
      status,
      headers: {
        "content-type": "application/json",
      },
    });

interface RouteHandlers {
  [key: string]: ((url: URL) => Promise<Response>) | (() => Promise<Response>);
}
const routes: RouteHandlers = {
  "/": async () => jsonResponse({ msg: "Hello World!" }),

  "/fpl/profile": async (url: URL) => {
    const query = new URLSearchParams(url.search);
    const entry = query.get("entry");

    if (!entry) {
      return jsonResponse({ msg: "Invalid entry" }, 400);
    }

    const data = await fetchProfile(entry);
    return jsonResponse(data);
  },

  "/fpl/leaderboard": async (url: URL) => {
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
  },
};

export const router = async (url: URL) => {
  try {
    const routeHandler = routes[url.pathname];

    if (routeHandler) {
      return await routeHandler(url);
    }

    return jsonResponse({msg:"404!"}, 404);

  } catch (err) {
    return errorResponse(err);
  }
};
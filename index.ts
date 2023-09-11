const fetchFPL = async (url: string) => {
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
interface FPLSummary {
  summary_overall_points: number;
  summary_event_points: number;
  summary_overall_rank: number;
  id: number;
  fplName: string;
  teamName: string;
  country: string;
  countryCode: string;
}
const fetchSummary = async (entry: string): Promise<FPLSummary> => {
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
    player_region_iso_code_long
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

const server = Bun.serve({
  port: 4001,
  async fetch(req) {
    const url = new URL(req.url);
    console.log(JSON.stringify(url));

    if (url.pathname === "/") return new Response("Home page!");

    if (url.pathname === "/fpl") {
      try {
        const query = new URLSearchParams(url.search);
        const entry = query.get("entry");

        if (!entry) {
          return new Response(JSON.stringify({ msg: "invalid entry" }), {
            status: 400,
            headers: {
              "content-type": "application/json",
            },
          });
        }

        const data = await fetchSummary(entry);
        return new Response(JSON.stringify(data), {
          headers: {
            "content-type": "application/json",
          },
        });

      } catch (err) {
        return new Response("something went wrong :/" + JSON.stringify(err), {
          status: 500,
          headers: {
            "content-type": "application/json",
          },
        });
      }
    }

    return new Response("404!", { status: 404 });
  },
});

console.log(`Listening on localhost:${server.port}`);

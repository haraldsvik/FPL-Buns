const fetchFPL = async (url: string) => {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "" } });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("FPL error", error);
  }
};

const fetchSummary = async (entry: string) => {
  let fplData = await fetchFPL(
    `https://fantasy.premierleague.com/api/entry/${entry}/`
  );

  const data = {
    summary_overall_points: fplData.summary_overall_points,
    summary_event_points: fplData.summary_event_points,
    summary_overall_rank: fplData.summary_overall_rank,
    id: fplData.id,
    fplName: `${fplData.player_first_name} ${fplData.player_last_name}`,
    teamName: fplData.name,
    country: fplData.player_region_name,
    countryCode: fplData.player_region_iso_code_long,
  };
  return data;
};

const server = Bun.serve({
  port: 4001,
  async fetch(req) {
    const url = new URL(req.url);
    console.log(JSON.stringify(url));
    if (url.pathname === "/") return new Response("Home page!");
    if (url.pathname === "/fpl") {
      try {
        console.log("here");
        const query = new URLSearchParams(url.search);
        const entry = query.get("entry") ?? "";
        console.log(entry);
        if (!entry)
          return new Response(JSON.stringify({ msg: "invalid entry" }));
        const data = await fetchSummary(entry);

        return new Response(JSON.stringify(data), {
          headers: {
            "content-type": "application/json",
          },
        });
      } catch (err) {
        return new Response("something went wrong :/" + JSON.stringify(err));
      }
    }
    return new Response("404!");
  },
});

console.log(`Listening on localhost:${server.port}`);

import { fetchProfile } from "../../handlers/profile";

export const router = async (url: URL) => {
  if (url.pathname === "/") return new Response("Hello World!");

  if (url.pathname === "/fpl/profile") {
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

      const data = await fetchProfile(entry);
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
};
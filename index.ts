import { errorResponse, router } from "./src/api/routes";

const server = Bun.serve({
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

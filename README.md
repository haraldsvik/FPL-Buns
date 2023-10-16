# fpl - Playing around with bun. 
Search for a Fantasy Premier League player by id and see their current score 


To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Create and Run a Production build with Docker

```sh
docker build -t fpl-buns:1.0 .
``````

```sh
docker run -p 4001:4001 fpl-buns:1.0
```

## Some curl examples
Healthcheck
```sh
curl http://localhost:4001/ 
```

Fetch FPL profile
```sh
curl http://localhost:4001/fpl/profile\?entry\=6478285 | jq
```

Fetch FPL profile
```sh
curl http://localhost:4001/fpl/invalidate   
```
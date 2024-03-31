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

## TODO

- [ ] Persist in-memory cache to disk - fly reboots often
- [ ] Periodically fetch interessting fpl profiles
- [ ] Logs

## Create and Run a Production build with Docker

```sh
docker build -t fpl-buns:1.0 .
```

```sh
docker run -p 4001:4001 fpl-buns:1.0
```

## Some curl examples

Healthcheck

```sh
curl http://localhost:4001/
```

```sh
curl https://fpl-buns.fly.dev/
```

Fetch FPL profile

```sh
curl http://localhost:4001/fpl/profile\?entry\=6478285 | jq
```

```sh
curl https://fpl-buns.fly.dev/fpl/profile\?entry\=6478285 | jq
```

Fetch FPL leaderboard

```sh
curl http://localhost:4001/fpl/leaderboard | jq
```

```sh
curl https://fpl-buns.fly.dev/fpl/leaderboard | jq
```

Fetch FPL profile

```sh
curl http://localhost:4001/fpl/invalidate
```

```sh
curl https://fpl-buns.fly.dev/fpl/invalidate
```

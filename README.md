# ChainArena

The idea of Chainarena is to be the infrastructure to onboard Web2 Games Onchain without building from scratch players compete in tournaments with on-chain ETH staking via a `TournamentPool` smart contract. Games integrate via API keys, users authenticate with JWT, and stakes are recorded against blockchain confirmation.

---

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js v5 |
| Database | MongoDB / Mongoose v8 |
| Auth | JWT + bcryptjs |
| Blockchain | Ethers.js v6 + Solidity|
| Contract | TournamentPool (ABI in `/abi`) |

---

## Environment Variables

```env
MONGODB_URI=
JWT_SECRET=
ALCHEMY_API_KEY=
TENDERLY_RPC_URL=
PORT=3001
```

---

## Getting Started

```bash
npm install
npm run dev
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/api/register` | — | `{ username, email, password }` |
| POST | `/api/login` | — | `{ email, password }` |
| POST | `/api/logout` | — | — |
| GET | `/api/me` | Bearer JWT | — |

### Games

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/api/putGames` | — | `{ name }` |
| GET | `/api/getGames` | — | — |

`POST /putGames` returns a unique `apiKey` used to authenticate game-level actions.

### Tournaments

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/api/createTournament` | — | `{ name, gameId, stakeAmount, minPlayers, maxPlayers }` |
| POST | `/api/tournaments/:id/join` | API Key | `{ code, walletAddress }` |
| GET | `/api/getTournament` | — | — |
| GET | `/api/tournaments/:id` | — | — |

`JOIN` requires the game's `apiKey` as the `Authorization` header (not Bearer-prefixed) and the tournament's `tournamentCode` as `code` in the body.

### Stakes

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/api/:tournamentId` | — | `{ walletAddress, stakeAmount }` |

Stake records are created with `status: "pending"` pending on-chain confirmation.

---

## Data Models

### User
```
name, email*, password (bcrypt), createdAt
```

### Game
```
name*, apiKey* (32-char hex), timestamps
```

### Tournament
```
name, gameId → Game, tournamentCode* (8-char hex),
stakeAmount, minPlayers (≥2), maxPlayers,
participants[{ userId, walletAddress, hasStaked, joinedAt }],
status: pending | ongoing | completed
```

### Stake
```
tournament → Tournament, walletAddress, stakeAmount,
status: pending | confirmed, timestamps
```

`*` unique

---

## Project Structure

```
index.js                  Entry point, middleware, route mounting
Controllers/              Request handlers
Models/                   Mongoose schemas
Routes/                   Express routers
Middleware/               JWT auth guard
helpers/                  Token + API key generation
db/                       MongoDB connection
abi/                      TournamentPool contract ABI
```

---

## Auth Flow

1. Register or login → password verified with bcrypt
2. JWT signed with `JWT_SECRET`, 7-day expiry, set as `httpOnly` cookie and returned in response body
3. Protected routes require `Authorization: Bearer <token>` header
4. `protect` middleware verifies the token and attaches the user to `req.user`

## Tournament Flow

1. Register a game → receive `apiKey`
2. Create a tournament linked to a `gameId`
3. Players join via `POST /tournaments/:id/join` using the game's `apiKey` and the tournament's `tournamentCode`
4. Players submit a stake via `POST /:tournamentId` with their wallet address
5. Stakes start as `pending` — on-chain confirmation updates them to `confirmed` (contract integration in progress)

---

## Frontend

Deployed at [chainarena-ten.vercel.app](https://chainarena-ten.vercel.app)

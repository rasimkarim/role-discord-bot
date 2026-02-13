# Discord Bot

This bot manages trial access on Discord servers: it syncs users with Supabase, assigns and updates roles, sends welcome messages, and periodically checks for expired trials.

## Features
- Automatically creates a user with a trial on server join
- Assigns `Free` and `Trial-Used` roles based on trial status
- Kicks users with expired trials (after role updates)
- Sends welcome messages to the `start-here` channel
- Periodic check for expired trials
- Slash command `/ping`

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create environment variables:
   ```bash
   TOKEN=your_discord_bot_token
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_role_key
   NODE_ENV=development
   ```
3. Start the bot:
   ```bash
   npm start
   ```

For local development:
```bash
npm run dev
```

## Environment Variables
- `TOKEN` — Discord bot token
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_KEY` — Supabase service role key
- `NODE_ENV` — `development` or `production`

## Architecture

### Overview
The project follows a layered architecture with clear separation of concerns: event and command handlers are isolated from business logic, and data access is encapsulated in repositories.

### Project Structure
```
src/
├── bot/                    — client creation and bootstrapping
├── commands/               — slash commands
├── events/                 — Discord event handlers
├── services/               — business logic
├── repositories/           — data access (Supabase)
├── utils/                  — shared helpers
├── config/                 — constants and intents
└── index.js                — entry point

api/
└── server.js               — serverless wrapper and health endpoints (Vercel)
```

### Layers and Responsibilities
- **Events/Commands**: thin layer that validates context and delegates to services.
- **Services**: business rules (trials, roles, welcome messages, periodic checks).
- **Repositories**: Supabase access and DB error handling.
- **Utils/Config**: shared helpers and configuration.

### Main Flows
1. **New member joins**
   - Check user in DB
   - Create a trial record if missing
   - Assign `Free` role
   - Send welcome message

2. **Periodic trial check**
   - Fetch expired trials
   - Update roles across all servers
   - Kick user after assigning `Trial-Used`

3. **Slash commands**
   - Parse command
   - Delegate to command module

### Data Model (Supabase `users` table)
- `discordId` — Discord user ID
- `username` — username
- `discriminator` — discriminator (if available)
- `guildId` — server ID
- `trialStart` — trial start date
- `trialEnd` — trial end date
- `created_at`, `updated_at`

### Entry Points
- `src/index.js` — main bot process
- `api/server.js` — serverless mode with health endpoints

### Configuration
- Discord intents: `src/config/intents.js`
- Roles, messages, intervals: `src/config/constants.js`

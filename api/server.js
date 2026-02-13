import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '../src/bot/client.js';
import { handleError } from '../src/utils/errors.js';
import * as readyEvent from '../src/events/ready.js';
import * as guildMemberAddEvent from '../src/events/guildMemberAdd.js';
import * as interactionCreateEvent from '../src/events/interactionCreate.js';

dotenv.config();

const client = createClient();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Discord bot is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    bot: client?.user ? 'online' : 'offline',
    timestamp: new Date().toISOString(),
  });
});

client.on('ready', () => readyEvent.execute(client));
client.on('guildMemberAdd', guildMemberAddEvent.execute);
client.on('interactionCreate', interactionCreateEvent.execute);

client.on('error', (error) => {
  handleError(error, 'Discord client');
});

process.on('unhandledRejection', (error) => {
  handleError(error, 'Unhandled promise rejection');
});

client.login(process.env.TOKEN).catch((error) => {
  handleError(error, 'Discord login');
});

export default app;

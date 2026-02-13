import { Client, GatewayIntentBits } from 'discord.js';
import { INTENTS } from '../config/intents.js';

export function createClient() {
  return new Client({
    intents: INTENTS,
  });
}

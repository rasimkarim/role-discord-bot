import dotenv from 'dotenv';
import { createClient } from './client.js';
import { logger } from '../utils/logger.js';
import { handleError } from '../utils/errors.js';
import * as readyEvent from '../events/ready.js';
import * as guildMemberAddEvent from '../events/guildMemberAdd.js';
import * as interactionCreateEvent from '../events/interactionCreate.js';

dotenv.config();

export async function start() {
  try {
    const client = createClient();

    client.on('ready', () => readyEvent.execute(client));
    client.on('guildMemberAdd', guildMemberAddEvent.execute);
    client.on('interactionCreate', interactionCreateEvent.execute);

    client.on('error', (error) => {
      handleError(error, 'Discord client');
    });

    process.on('unhandledRejection', (error) => {
      handleError(error, 'Unhandled promise rejection');
    });

    await client.login(process.env.TOKEN);

    logger.info('Bot is online!');

    return client;
  } catch (error) {
    logger.error('Critical error when starting the bot:', { error: error.message });
    process.exit(1);
  }
}

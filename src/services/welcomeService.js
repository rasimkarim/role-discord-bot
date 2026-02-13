import { CHANNELS, MESSAGES } from '../config/constants.js';
import { logger } from '../utils/logger.js';

export class WelcomeService {
  
  static async sendWelcomeMessage(member) {
    try {
      const welcomeChannel = member.guild.channels.cache.find(
        ch => ch.name === CHANNELS.WELCOME && ch.isTextBased()
      );

      if (welcomeChannel) {
        await welcomeChannel.send(
          MESSAGES.WELCOME(member.user.toString(), member.guild.name)
        );
        logger.info(`Welcome message sent to user: ${member.user.tag}`);
      } else {
        logger.warn(`Channel ${CHANNELS.WELCOME} not found on server ${member.guild.name}`);
      }
    } catch (error) {
      logger.error(`Error sending welcome message to user: ${member.user.tag}`, { error: error.message });
    }
  }
}

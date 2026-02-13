import { UserRepository } from '../repositories/index.js';
import { logger } from '../utils/logger.js';
import { TRIAL_DURATION } from '../config/constants.js';

export class UserService {
  
  static async createWithTrial(userData) {
    const { discordId, username, discriminator, guildId } = userData;

    const trialStart = new Date().toISOString();
    const trialEnd = new Date(new Date().getTime() + TRIAL_DURATION.DAYS_30).toISOString();

    const result = await UserRepository.create({
      discordId,
      username,
      discriminator,
      guildId,
      trialStart,
      trialEnd,
    });

    if (result.success) {
      logger.info(`Created user with trial: ${username}`, { discordId });
    } else {
      logger.warn(`Failed to create user: ${username}`, { error: result.error });
    }

    return result;
  }

  static async getByDiscordId(discordId) {
    return UserRepository.findByDiscordId(discordId);
  }

  static async update(discordId, updates) {
    return UserRepository.update(discordId, updates);
  }

  static async upsert(userData) {
    return UserRepository.upsert(userData);
  }
}

import { TrialRepository } from '../repositories/index.js';
import { logger } from '../utils/logger.js';

export class TrialService {
  
  static async getExpired() {
    const result = await TrialRepository.findExpired();
    
    if (result.success) {
      logger.info(`Found users with expired trials: ${result.data.length}`);
    } else {
      logger.error('Error getting expired trials', { error: result.error });
    }

    return result;
  }

  static async getActive() {
    return TrialRepository.findActive();
  }

  static async update(discordId, trialStart, trialEnd) {
    return TrialRepository.updateTrial(discordId, trialStart, trialEnd);
  }
}

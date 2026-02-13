import { startTrialChecker } from '../services/trialCheckService.js';
import { INTERVALS } from '../config/constants.js';
import { logger } from '../utils/logger.js';

export async function execute(client) {
  logger.info(`${client.user.tag} is online!`);
  
  startTrialChecker(client, INTERVALS.TRIAL_CHECK);
}

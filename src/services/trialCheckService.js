import { TrialService } from './trialService.js';
import { RoleService } from './roleService.js';
import { shouldKickForExpiredTrial } from '../utils/authUtils.js';
import { MESSAGES } from '../config/constants.js';
import { logger } from '../utils/logger.js';

export class TrialCheckService {
  
  static async updateUserRoles(client, userData) {
    const results = {
      updated: 0,
      notFound: 0,
      errors: 0,
      details: []
    };

    try {
      for (const [guildId, guild] of client.guilds.cache) {
        try {
          const member = await guild.members.fetch(userData.discordId).catch(() => null);
          
          if (!member) {
            results.notFound++;
            continue;
          }

          if (shouldKickForExpiredTrial(userData)) {
            if (RoleService.hasFreeRole(member)) {
              const roleResult = await RoleService.assignTrialUsedRole(member);
              
              if (roleResult.added) {
                results.updated++;
                results.details.push({
                  guild: guild.name,
                  user: member.user.tag,
                  action: 'Trial expired: Free role removed, Trial-Used role added, user kicked'
                });
                
                await member.kick(MESSAGES.TRIAL_EXPIRED);
              }
              
              if (roleResult.errors.length > 0) {
                results.errors++;
                logger.warn(`[Trial Check] Errors updating roles for ${member.user.tag}:`, { errors: roleResult.errors });
              }
            } else {
              logger.debug(`[Trial Check] User ${member.user.tag} already processed on server ${guild.name}`);
            }
          } else {
            const roleResult = await RoleService.assignFreeRole(member);
            
            if (roleResult.added) {
              results.updated++;
              results.details.push({
                guild: guild.name,
                user: member.user.tag,
                action: 'Free role added'
              });
            }
            
            if (roleResult.errors.length > 0) {
              results.errors++;
              logger.warn(`[Trial Check] Errors updating roles for ${member.user.tag}:`, { errors: roleResult.errors });
            }
          }
        } catch (error) {
          results.errors++;
          logger.error(`Error updating roles for ${userData.username} on server ${guild.name}:`, { error: error.message });
        }
      }
    } catch (error) {
      logger.error('Error updating roles for user:', { error: error.message });
    }

    return results;
  }

  static async checkAndUpdateExpiredTrials(client) {
    logger.info('[Trial Check] Starting expired trials check...');
    
    const result = await TrialService.getExpired();
    
    if (!result.success) {
      logger.error('[Trial Check] Error getting users:', { error: result.error });
      return { checked: 0, updated: 0, errors: 0 };
    }

    const expiredUsers = result.data;
    logger.info(`[Trial Check] Found users with expired trials: ${expiredUsers.length}`);

    let totalUpdated = 0;
    let totalErrors = 0;

    for (const user of expiredUsers) {
      try {
        const updateResult = await this.updateUserRoles(client, user);
        totalUpdated += updateResult.updated;
        totalErrors += updateResult.errors;
        
        if (updateResult.updated > 0) {
          logger.info(`[Trial Check] Updated roles for ${user.username} on ${updateResult.updated} servers`);
        }
      } catch (error) {
        totalErrors++;
        logger.error(`[Trial Check] Error processing user ${user.username}:`, { error: error.message });
      }
    }

    logger.info(`[Trial Check] Check completed. Updated: ${totalUpdated}, Errors: ${totalErrors}`);
    
    return {
      checked: expiredUsers.length,
      updated: totalUpdated,
      errors: totalErrors
    };
  }

  static start(client, intervalMs = 60 * 60 * 1000) {
    logger.info(`[Trial Check] Starting periodic trial check (interval: ${intervalMs / 1000 / 60} minutes)`);
    
    this.checkAndUpdateExpiredTrials(client).catch(error => {
      logger.error('[Trial Check] Error during first check:', { error: error.message });
    });
    
    setInterval(() => {
      this.checkAndUpdateExpiredTrials(client).catch(error => {
        logger.error('[Trial Check] Error during periodic check:', { error: error.message });
      });
    }, intervalMs);
  }
}

export function startTrialChecker(client, intervalMs) {
  TrialCheckService.start(client, intervalMs);
}

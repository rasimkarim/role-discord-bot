import { findRole, addRole, removeRole, setFreeRole, setTrialUsedRole, hasFreeRole } from '../utils/roleUtils.js';
import { logger } from '../utils/logger.js';

export class RoleService {
  
  static async assignFreeRole(member) {
    const result = await setFreeRole(member);
    
    if (result.added) {
      logger.info(`Free role assigned to user: ${member.user.tag}`);
    } else if (result.errors.length > 0) {
      logger.warn(`Errors assigning Free role to user: ${member.user.tag}`, { errors: result.errors });
    }

    return result;
  }

  static async assignTrialUsedRole(member) {
    const result = await setTrialUsedRole(member);
    
    if (result.added) {
      logger.info(`Trial-Used role assigned to user: ${member.user.tag}`);
    } else if (result.errors.length > 0) {
      logger.warn(`Errors assigning Trial-Used role to user: ${member.user.tag}`, { errors: result.errors });
    }

    return result;
  }

  static hasFreeRole(member) {
    return hasFreeRole(member);
  }

  static findRole(guild, roleName) {
    return findRole(guild, roleName);
  }
}

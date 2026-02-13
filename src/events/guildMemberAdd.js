import { UserService } from '../services/userService.js';
import { RoleService } from '../services/roleService.js';
import { WelcomeService } from '../services/welcomeService.js';
import { shouldKickForExpiredTrial, checkTrialStatus } from '../utils/authUtils.js';
import { MESSAGES } from '../config/constants.js';
import { logger } from '../utils/logger.js';

export async function execute(member) {
  logger.info(`New user: ${member.user.tag} joined the server ${member.guild.name}`);

  const existingUser = await UserService.getByDiscordId(member.user.id);

  if (existingUser.success && existingUser.data) {
    await handleExistingUser(member, existingUser.data);
  } else {
    await handleNewUser(member);
  }

  await WelcomeService.sendWelcomeMessage(member);
}

async function handleExistingUser(member, userData) {
  logger.info(`User ${member.user.tag} already exists in the database, skipping creation`);

  if (shouldKickForExpiredTrial(userData)) {
    await handleExpiredTrial(member, userData);
  } else {
    await handleActiveTrial(member, userData);
  }
}

async function handleExpiredTrial(member, userData) {
  try {
    if (RoleService.hasFreeRole(member)) {
      const roleResult = await RoleService.assignTrialUsedRole(member);
      
      if (roleResult.added) {
        await member.kick(MESSAGES.TRIAL_EXPIRED);
        logger.info(`User ${member.user.tag} successfully kicked (trial expired)`);
      }
      
      if (roleResult.errors.length > 0) {
        logger.warn(`Errors updating roles for ${member.user.tag}:`, { errors: roleResult.errors });
      }
    } else {
      logger.info(`User ${member.user.tag} already has the Trial-Used role, skipping kick`);
    }
  } catch (error) {
    logger.error(`Error processing expired trial for ${member.user.tag}:`, { error: error.message });
  }
}

async function handleActiveTrial(member, userData) {
  const trialStatus = checkTrialStatus(userData);
  
  if (trialStatus.hasTrial) {
    logger.info(`User ${member.user.tag} has an active trial (remaining days: ${trialStatus.daysRemaining})`);
  } else {
    logger.info(`User ${member.user.tag} does not have a trial set`);
  }

  const roleResult = await RoleService.assignFreeRole(member);
  
  if (roleResult.errors.length > 0) {
    logger.warn(`Errors updating roles for ${member.user.tag}:`, { errors: roleResult.errors });
  }
}

async function handleNewUser(member) {
  const result = await UserService.createWithTrial({
    discordId: member.user.id,
    username: member.user.username,
    discriminator: member.user.discriminator,
    guildId: member.guild.id,
  });

  if (result.success) {
    const roleResult = await RoleService.assignFreeRole(member);
    
    if (!roleResult.added && roleResult.errors.length > 0) {
      logger.warn(`Failed to add Free role to new user:`, { errors: roleResult.errors });
    }
  } else {
    logger.error(`Error creating user: ${result.error}`);
  }
}

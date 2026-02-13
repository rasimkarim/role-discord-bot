import { ROLES } from '../config/constants.js';

export function findRole(guild, roleName) {
  return guild.roles.cache.find(r => r.name === roleName) || null;
}

export async function addRole(member, roleName) {
  try {
    const role = findRole(member.guild, roleName);
    
    if (!role) {
      return {
        success: false,
        error: `Role ${roleName} not found on server ${member.guild.name}`,
      };
    }

    if (member.roles.cache.has(role.id)) {
      return {
        success: false,
        error: `User ${member.user.tag} already has the role ${roleName}`,
      };
    }

    await member.roles.add(role);
    
    return {
      success: true,
      role: roleName,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function removeRole(member, roleName) {
  try {
    const role = findRole(member.guild, roleName);
    
    if (!role) {
      return {
        success: false,
        error: `Role ${roleName} not found on server ${member.guild.name}`,
      };
    }

    if (!member.roles.cache.has(role.id)) {
      return {
        success: false,
        error: `User ${member.user.tag} does not have the role ${roleName}`,
      };
    }

    await member.roles.remove(role);
    
    return {
      success: true,
      role: roleName,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function setFreeRole(member) {
  const results = {
    removed: false,
    added: false,
    errors: [],
  };

  const removeResult = await removeRole(member, ROLES.TRIAL_USED);
  if (removeResult.success) {
    results.removed = true;
  } else if (removeResult.error && !removeResult.error.includes('no role')) {
    results.errors.push(removeResult.error);
  }

  const addResult = await addRole(member, ROLES.FREE);
  if (addResult.success) {
    results.added = true;
  } else if (addResult.error) {
    results.errors.push(addResult.error);
  }

  return results;
}

export async function setTrialUsedRole(member) {
  const results = {
    removed: false,
    added: false,
    errors: [],
  };

  const removeResult = await removeRole(member, ROLES.FREE);
  if (removeResult.success) {
    results.removed = true;
  } else if (removeResult.error && !removeResult.error.includes('no role')) {
    results.errors.push(removeResult.error);
  }

  const addResult = await addRole(member, ROLES.TRIAL_USED);
  if (addResult.success) {
    results.added = true;
  } else if (addResult.error) {
    results.errors.push(addResult.error);
  }

  return results;
}

export function hasFreeRole(member) {
  const role = findRole(member.guild, ROLES.FREE);
  return role ? member.roles.cache.has(role.id) : false;
}

export function hasTrialUsedRole(member) {
  const role = findRole(member.guild, ROLES.TRIAL_USED);
  return role ? member.roles.cache.has(role.id) : false;
}

export const ROLES = {
  FREE: 'Free',
  TRIAL_USED: 'Trial-Used',
};

export const CHANNELS = {
  WELCOME: 'start-here',
};

export const INTERVALS = {
  TRIAL_CHECK: 6 * 60 * 60 * 1000, 
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
};

export const TRIAL_DURATION = {
  DAYS_30: 30 * 24 * 60 * 60 * 1000,
};

export const MESSAGES = {
  WELCOME: (username, guildName) => `Hello, ${username}! Welcome to the server ${guildName} 👋`,
  TRIAL_EXPIRED: 'Trial expired',
};

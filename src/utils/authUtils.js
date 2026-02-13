export function checkTrialStatus(userData) {
  if (!userData || !userData.trialEnd) {
    return {
      isExpired: false,
      hasTrial: false,
      trialEndDate: null,
      daysRemaining: null,
    };
  }

  const trialEndDate = new Date(userData.trialEnd);
  const now = new Date();
  const isExpired = trialEndDate < now;

  let daysRemaining = null;
  if (!isExpired) {
    const diffTime = trialEndDate - now;
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return {
    isExpired,
    hasTrial: true,
    trialEndDate,
    daysRemaining,
  };
}

export function shouldKickForExpiredTrial(userData) {
  const trialStatus = checkTrialStatus(userData);
  return trialStatus.hasTrial && trialStatus.isExpired;
}

export const convertExpirationTimeToMs = (expiration: string): number | null => {
  let expirationMultiplier: number;

  switch (expiration[expiration.length - 1]) {
    case 'd':
      expirationMultiplier = 24 * 60 * 60 * 1000;
      break;

    case 'h':
      expirationMultiplier = 60 * 60 * 1000;
      break;

    case 'm':
      expirationMultiplier = 60 * 1000;
      break;

    default:
      return null;
  }

  return Number(expiration.slice(0, expiration.length - 1)) * expirationMultiplier;
};

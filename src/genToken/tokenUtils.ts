export const generateRandomToken = (): string => {
    // Generate a unique token (you can use a more secure method in production)
    return Math.random().toString(36).slice(2);
  };
export const getEnv = (name: string) => {
  if (!process.env[name]) {
    throw new Error(`Environment variable missing - ${name}`);
  }

  return name;
};

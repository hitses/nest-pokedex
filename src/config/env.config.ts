export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 3000,
  mongoDb: process.env.MONGO_DB,
  defaultLimit: parseInt(process.env.DEFAULT_LIMIT) || 20,
  offsetLimit: parseInt(process.env.OFFSET_LIMIT) || 0,
});

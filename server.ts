import app from '@/app';
import env from '@/config/environment';
import { connectDatabase } from '@/config/database';

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});

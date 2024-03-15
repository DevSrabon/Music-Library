import createUserSchema from '../app/modules/user/user.model';
import db from './db';
import { errorLogger, logger } from './logger';

const runDbMigrations = async () => {
  logger.info('BEGIN DB MIGRATION');

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    await client.query(createUserSchema);

    await client.query('COMMIT');

    logger.info('END DB MIGRATION');
  } catch (e) {
    await client.query('ROLLBACK');

    errorLogger.error('DB migration failed');

    throw new Error(e as string);
  } finally {
    client.release();
  }
};

export default runDbMigrations;
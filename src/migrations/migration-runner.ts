import { up as usersMigration } from './001_init_users';

export async function runMigrations() {
  await usersMigration();
  console.log('✅ Migrations complete');
}

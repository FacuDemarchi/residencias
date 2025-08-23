import { defineConfig } from '@postgrestools/postgrestools';

export default defineConfig({
  database: {
    host: 'db.pxjeifzojuckaknwlwgp.supabase.co',
    port: 5432,
    username: 'postgres',
    password: '5lti94XYK0fGjGBG',
    database: 'postgres',
    ssl: true
  },
  types: {
    output: './src/types/database.ts',
    schema: 'public'
  },
  migrations: {
    directory: './migrations'
  },
  seeders: {
    directory: './seeders'
  }
});

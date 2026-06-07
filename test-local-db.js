/* eslint-disable */
const postgres = require('postgres');
async function test() {
  const urls = [
    'postgresql://postgres:postgres@localhost:5432/postgres',
    'postgresql://postgres:170601Dinh%40%2A@localhost:5432/postgres',
    'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
    'postgresql://postgres:170601Dinh%40%2A@127.0.0.1:5432/postgres'
  ];
  for (const url of urls) {
    console.log('Testing connection to:', url.replace(/:[^:@]+@/, ':***@'));
    const sql = postgres(url, { connect_timeout: 3 });
    try {
      const res = await sql`SELECT version();`;
      console.log('Success! version:', res[0].version);
      const dbs = await sql`SELECT datname FROM pg_database WHERE datistemplate = false;`;
      console.log('Databases:', dbs.map(d => d.datname));
      await sql.end();
      return url;
    } catch (e) {
      console.log('Failed:', e.message);
    }
  }
  console.log('All local connections failed.');
}
test();

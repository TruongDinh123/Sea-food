import postgres from 'postgres';

async function run() {
  console.log('Testing direct IPv6 connection...');
  const sql = postgres({
    host: '2406:da18:1f7e:b102:44e0:b92b:b81f:c7cb',
    port: 5432,
    user: 'postgres',
    password: '170601Dinh@*', // decoded password '@*'
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    const res = await sql`SELECT NOW()`;
    console.log('✅ Connection Success:', res);
  } catch (err) {
    console.error('❌ Connection Error:', err);
  } finally {
    await sql.end();
  }
}
run();

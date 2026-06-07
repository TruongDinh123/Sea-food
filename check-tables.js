/* eslint-disable */
const sql = require('./src/lib/db/index.ts');
// Wait, we need to run it. But wait, it's typescript. We can use tsx.
async function run() {
  try {
    const schemas = await sql.default`
      SELECT schema_name FROM information_schema.schemata;
    `;
    console.log('Schemas:', schemas.map(s => s.schema_name));

    const tables = await sql.default`
      SELECT table_schema, table_name FROM information_schema.tables 
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
    `;
    console.log('Tables:');
    tables.forEach(t => {
      console.log(`- ${t.table_schema}.${t.table_name}`);
    });
  } catch (error) {
    console.error('Error querying DB:', error);
  } finally {
    await sql.default.end();
  }
}
run();

import postgres from 'postgres';

async function testConnection() {
  try {
    console.log('Testing connection to:', process.env.POSTGRES_URL?.split('@')[1] || 'unknown');

    const sql = postgres(process.env.POSTGRES_URL!);

    console.log('Attempting connection...');
    const result = await sql`SELECT NOW() as time`;

    console.log('✓ Connection successful!');
    console.log('Current database time:', result[0].time);

    await sql.end();
  } catch (error) {
    console.error('✗ Connection failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testConnection();

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'IQBAL',
  database: process.env.DB_NAME || 'portal_cuti',
});

async function migrate() {
  const mapping = {
    'C1': 'sum_leave',
    'C2': 'total_pengajuan',
    'C3': 'approval_rate',
    'C4': 'sisa_cuti',
    'C5': 'masa_kerja',
  };

  for (const [kode, sumber] of Object.entries(mapping)) {
    const result = await pool.query(
      'UPDATE criteria SET sumber_data = $1 WHERE kode = $2 RETURNING kode, sumber_data',
      [sumber, kode]
    );
    if (result.rows.length > 0) {
      console.log(`Updated ${kode} -> sumber_data = "${sumber}"`);
    } else {
      console.log(`${kode} not found, skipped`);
    }
  }

  // Show final state
  const all = await pool.query('SELECT kode, nama, sumber_data, bobot, tipe FROM criteria ORDER BY kode');
  console.log('\nFinal criteria:');
  console.table(all.rows);

  await pool.end();
}

migrate().catch(err => { console.error(err); process.exit(1); });

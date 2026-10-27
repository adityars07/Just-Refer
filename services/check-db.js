import { query } from '../services/shared/db.js';

async function main() {
  const c = await query(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name IN ('partners', 'referral_leads')
    ORDER BY table_name, ordinal_position;
  `);
  console.log(JSON.stringify(c.rows, null, 2));

  const p = await query(`SELECT * FROM partners LIMIT 5;`);
  console.log('Partners sample:', JSON.stringify(p.rows, null, 2));

  const r = await query(`SELECT * FROM referral_leads LIMIT 5;`);
  console.log('Referral leads sample:', JSON.stringify(r.rows, null, 2));

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

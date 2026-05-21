// Test inserting a row and reading it back from Supabase

const SUPABASE_URL = 'https://kyhipdzgmmabxecpcbxj.supabase.co';
const ANON_KEY = 'sb_publishable_raSMkoD4y4BzQ5eLfhnnOg_eTZueWFS';

const headers = {
  'Content-Type': 'application/json',
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
  'Prefer': 'return=representation',
};

const testRow = {
  id: `TN-GRV-TEST${Date.now().toString().slice(-6)}`,
  fullName: 'Test User',
  phone: '9999999999',
  email: 'test@example.com',
  district: 'Chennai',
  constituency: 'Dr. Radhakrishnan Nagar',
  issue: 'This is a test grievance to verify Supabase connectivity.',
  attachments: [],
  officer: 'District Revenue Officer - Chennai',
  mla: 'Test MLA',
  status: 'submitted',
  date: new Date().toISOString().split('T')[0],
};

async function main() {
  console.log('--- Attempting INSERT ---');
  console.log('Row to insert:', JSON.stringify(testRow, null, 2));

  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/grievances`, {
    method: 'POST',
    headers,
    body: JSON.stringify(testRow),
  });

  const insertBody = await insertRes.text();
  console.log(`\nInsert status: HTTP ${insertRes.status}`);
  console.log('Insert response:', insertBody);

  if (insertRes.status >= 200 && insertRes.status < 300) {
    console.log('\n✅ INSERT SUCCEEDED!');
  } else {
    console.log('\n❌ INSERT FAILED! See error above.');
    console.log('\n--- Checking table columns ---');
    const colRes = await fetch(`${SUPABASE_URL}/rest/v1/grievances?limit=0`, {
      headers: { ...headers, 'Accept': 'application/json' },
    });
    console.log(`Column check HTTP ${colRes.status}`);
  }

  // Also try a SELECT to see current rows
  console.log('\n--- Current rows in grievances table ---');
  const selectRes = await fetch(`${SUPABASE_URL}/rest/v1/grievances?select=id,status,date&order=created_at.desc&limit=5`, {
    headers,
  });
  const rows = await selectRes.text();
  console.log(`Select HTTP ${selectRes.status}:`, rows);
}

main().catch(e => { console.error(e); process.exit(1); });

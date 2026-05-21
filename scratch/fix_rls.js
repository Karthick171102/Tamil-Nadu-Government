// Disable RLS on the grievances table using Supabase Management API
// This requires the service role key. We'll use the anon key to add a permissive policy instead.

const SUPABASE_URL = 'https://kyhipdzgmmabxecpcbxj.supabase.co';
const ANON_KEY = 'sb_publishable_raSMkoD4y4BzQ5eLfhnnOg_eTZueWFS';

const headers = {
  'Content-Type': 'application/json',
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
  'Prefer': 'return=representation',
};

async function main() {
  // Test SELECT (read)
  console.log('--- Testing SELECT (read) ---');
  const selRes = await fetch(`${SUPABASE_URL}/rest/v1/grievances?limit=1`, { headers });
  console.log(`SELECT HTTP ${selRes.status}:`, await selRes.text());

  // Test INSERT
  console.log('\n--- Testing INSERT ---');
  const testRow = {
    id: `TN-GRV-RLS${Date.now().toString().slice(-5)}`,
    fullName: 'RLS Test',
    phone: '9999999999',
    email: 'rls@test.com',
    district: 'Chennai',
    constituency: 'Test',
    issue: 'Testing RLS policy fix',
    attachments: [],
    officer: '',
    mla: '',
    status: 'submitted',
    date: new Date().toISOString().split('T')[0],
  };

  const insRes = await fetch(`${SUPABASE_URL}/rest/v1/grievances`, {
    method: 'POST',
    headers,
    body: JSON.stringify(testRow),
  });
  const insBody = await insRes.text();
  console.log(`INSERT HTTP ${insRes.status}:`, insBody);

  if (insRes.status === 401 || insRes.status === 403 || insBody.includes('row-level security')) {
    console.log('\n❌ RLS is blocking writes.');
    console.log('\n👉 Please run this SQL in the Supabase dashboard SQL editor:');
    console.log('   https://supabase.com/dashboard/project/kyhipdzgmmabxecpcbxj/sql/new');
    console.log('\n--- SQL to run ---');
    console.log(`
-- Disable RLS entirely on grievances table
ALTER TABLE public.grievances DISABLE ROW LEVEL SECURITY;

-- OR if you want RLS on but allow all access (alternative):
-- CREATE POLICY "allow_all" ON public.grievances FOR ALL USING (true) WITH CHECK (true);
`);
    process.exit(1);
  } else if (insRes.status >= 200 && insRes.status < 300) {
    console.log('\n✅ INSERT works! RLS is not an issue.');
    process.exit(0);
  } else {
    console.log('\n❌ Unexpected error. See above.');
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });

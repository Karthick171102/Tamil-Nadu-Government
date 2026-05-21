// Creates the grievances table in Supabase via the REST SQL endpoint
// Uses the service-role key approach by posting to the SQL endpoint

const SUPABASE_URL = 'https://kyhipdzgmmabxecpcbxj.supabase.co';
const ANON_KEY = 'sb_publishable_raSMkoD4y4BzQ5eLfhnnOg_eTZueWFS';

const sql = `
-- Create grievances table if it doesn't exist
create table if not exists public.grievances (
  id text primary key,
  "fullName" text not null,
  phone text not null,
  email text not null,
  district text not null,
  constituency text not null,
  issue text not null,
  attachments jsonb,
  officer text,
  mla text,
  status text not null default 'submitted',
  date date not null,
  resolution text,
  created_at timestamptz default now()
);

-- Disable RLS so the publishable/anon key can read and write
alter table public.grievances disable row level security;
`;

// Try the Supabase REST SQL endpoint (available in all plans)
async function runSQL() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  return res;
}

// Alternative: use the pg-meta endpoint
async function tryPgMeta() {
  const res = await fetch(`${SUPABASE_URL}/pg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  return res;
}

// Test if the table already exists by querying it
async function checkTableExists() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/grievances?limit=1`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
    },
  });
  return { status: res.status, body: await res.text() };
}

async function main() {
  console.log('Checking if grievances table exists...');
  const check = await checkTableExists();
  console.log(`Table check: HTTP ${check.status}`);
  console.log('Response:', check.body.slice(0, 200));

  if (check.status === 200) {
    console.log('\n✅ Table already exists and is accessible!');
    process.exit(0);
  }

  if (check.status === 404 || check.body.includes('relation') || check.body.includes('schema cache')) {
    console.log('\n❌ Table does not exist. You need to create it manually in the Supabase dashboard.');
    console.log('\nGo to: https://supabase.com/dashboard/project/kyhipdzgmmabxecpcbxj/sql/new');
    console.log('\nPaste and run this SQL:\n');
    console.log(`create table if not exists public.grievances (
  id text primary key,
  "fullName" text not null,
  phone text not null,
  email text not null,
  district text not null,
  constituency text not null,
  issue text not null,
  attachments jsonb,
  officer text,
  mla text,
  status text not null default 'submitted',
  date date not null,
  resolution text,
  created_at timestamptz default now()
);

alter table public.grievances disable row level security;`);
    process.exit(1);
  }

  console.log('\nUnexpected status, check response above.');
  process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });

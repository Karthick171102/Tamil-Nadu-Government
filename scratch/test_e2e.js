// Full end-to-end test: insert a row + upload a file to Supabase Storage

const SUPABASE_URL = 'https://kyhipdzgmmabxecpcbxj.supabase.co';
const ANON_KEY = 'sb_publishable_raSMkoD4y4BzQ5eLfhnnOg_eTZueWFS';

const headers = {
  'Content-Type': 'application/json',
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
};

async function main() {
  const refId = `TN-GRV-E2E${Date.now().toString().slice(-5)}`;

  // ── 1. Upload a test file to Storage ─────────────────────────────────────
  console.log('\n--- 1. Uploading test file to grievance-attachments bucket ---');
  const testFileContent = Buffer.from('This is a test PDF file content for E2E verification.');
  const path = `${refId}/0_test.txt`;

  const uploadRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/grievance-attachments/${path}`,
    {
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'text/plain',
        'Cache-Control': '3600',
        'x-upsert': 'false',
      },
      body: testFileContent,
    }
  );
  const uploadBody = await uploadRes.text();
  console.log(`Upload HTTP ${uploadRes.status}:`, uploadBody);

  if (uploadRes.status >= 300) {
    console.log('\n❌ STORAGE UPLOAD FAILED!');
    if (uploadBody.includes('bucket') || uploadBody.includes('not found')) {
      console.log('   → The bucket "grievance-attachments" may not exist or may not be public.');
    }
    process.exit(1);
  }

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/grievance-attachments/${path}`;
  console.log(`\n✅ File uploaded! Public URL:\n   ${publicUrl}`);

  // ── 2. Insert a grievance row referencing the file URL ────────────────────
  console.log('\n--- 2. Inserting grievance row into database ---');
  const row = {
    id: refId,
    fullName: 'E2E Test User',
    phone: '9876543210',
    email: 'e2e@test.com',
    district: 'Chennai',
    constituency: 'Harbour',
    issue: 'End-to-end test grievance with Supabase Storage attachment.',
    attachments: [{ type: 'text/plain', name: 'test.txt', url: publicUrl }],
    officer: 'District Revenue Officer - Chennai',
    mla: 'Test MLA',
    status: 'submitted',
    date: new Date().toISOString().split('T')[0],
  };

  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/grievances`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=representation' },
    body: JSON.stringify(row),
  });
  const insertBody = await insertRes.text();
  console.log(`Insert HTTP ${insertRes.status}:`, insertBody.slice(0, 200));

  if (insertRes.status >= 300) {
    console.log('\n❌ DATABASE INSERT FAILED!');
    process.exit(1);
  }

  // ── 3. Query back the row ─────────────────────────────────────────────────
  console.log('\n--- 3. Querying row back by ID ---');
  const selectRes = await fetch(
    `${SUPABASE_URL}/rest/v1/grievances?id=eq.${refId}&select=id,status,attachments`,
    { headers }
  );
  const selectBody = await selectRes.text();
  console.log(`Select HTTP ${selectRes.status}:`, selectBody);

  // ── 4. Fetch the public file URL ──────────────────────────────────────────
  console.log('\n--- 4. Fetching uploaded file via public URL ---');
  const fileRes = await fetch(publicUrl);
  console.log(`File fetch HTTP ${fileRes.status}`);
  if (fileRes.ok) {
    const text = await fileRes.text();
    console.log('File contents:', text);
  }

  const allPassed = insertRes.status < 300 && fileRes.ok;
  if (allPassed) {
    console.log('\n✅ ALL TESTS PASSED! Supabase DB + Storage are fully connected.');
    process.exit(0);
  } else {
    console.log('\n❌ SOME TESTS FAILED.');
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });

#!/usr/bin/env node
// Smoke test for schein.in — runs from any machine with Node 18+
// Usage: node scripts/smoke-test.mjs [https://schein.in]

const BASE = process.argv[2] || 'https://schein.in';
const start = Date.now();

const tests = [
  { name: 'Home page',          url: '/' },
  { name: 'Shop page',          url: '/shop' },
  { name: 'Shop — Women',       url: '/shop?category=Women' },
  { name: 'Shop — Kid',         url: '/shop?category=Kid' },
  { name: 'Cart page',          url: '/cart' },
  { name: 'Account login page', url: '/account/login' },
  { name: 'Admin login page',   url: '/admin/login' },
  { name: 'Franchise page',     url: '/franchise' },
  { name: 'API: products',      url: '/api/products?merged=true', expect: (j) => Array.isArray(j.products) && j.products.length > 0 },
  { name: 'API: products (Women)', url: '/api/products?category=Women&merged=true', expect: (j) => Array.isArray(j.products) },
  { name: 'API: featured',      url: '/api/products?featured=true&merged=true', expect: (j) => Array.isArray(j.products) },
  { name: 'API: auth check',    url: '/api/auth', expect: (j) => 'authenticated' in j },
];

let pass = 0, fail = 0;
const failures = [];

for (const t of tests) {
  const url = `${BASE}${t.url}`;
  const t0 = Date.now();
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const ms = Date.now() - t0;
    let ok = res.ok || res.status === 200;

    if (t.expect && ok) {
      const body = await res.json();
      ok = t.expect(body);
    }

    if (ok) {
      console.log(`✅ ${t.name.padEnd(28)} ${res.status} (${ms}ms)`);
      pass++;
    } else {
      console.log(`❌ ${t.name.padEnd(28)} ${res.status} (${ms}ms)`);
      failures.push({ ...t, status: res.status });
      fail++;
    }
  } catch (err) {
    console.log(`❌ ${t.name.padEnd(28)} ERROR: ${err.message}`);
    failures.push({ ...t, error: err.message });
    fail++;
  }
}

const total = Date.now() - start;
console.log('');
console.log('─'.repeat(50));
console.log(`Result: ${pass}/${pass + fail} passed   Total: ${total}ms`);

if (fail > 0) {
  console.log('');
  console.log('Failures:');
  failures.forEach((f) => {
    console.log(`  • ${f.name} — ${f.error || `HTTP ${f.status}`}`);
  });
  process.exit(1);
}

process.exit(0);

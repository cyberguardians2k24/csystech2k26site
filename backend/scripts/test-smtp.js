/*
  SMTP / Nodemailer self-test

  Usage (PowerShell):
    cd backend
    $env:SMTP_HOST="smtp.gmail.com"
    $env:SMTP_PORT="587"
    $env:SMTP_SECURE="false"
    $env:SMTP_USER="your@gmail.com"
    $env:SMTP_PASS="xxxx xxxx xxxx xxxx"   # app password; spaces ok
    $env:SMTP_FROM="CYSTECH 2K26 <your@gmail.com>"
    $env:TEST_EMAIL_TO="someone@example.com"
    npm run smtp:test

  This script will:
    1) connect + verify SMTP
    2) send a test email
*/

const nodemailer = require('nodemailer');

function normalizeBool(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (raw === 'true' || raw === '1' || raw === 'yes') return true;
  if (raw === 'false' || raw === '0' || raw === 'no') return false;
  return null;
}

function required(name, value) {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

async function main() {
  const host = String(process.env.SMTP_HOST ?? '').trim();
  const port = Number(process.env.SMTP_PORT ?? '587');
  const smtpSecureRaw = normalizeBool(process.env.SMTP_SECURE);
  const secure = smtpSecureRaw ?? port === 465;
  const user = String(process.env.SMTP_USER ?? '').trim();
  const pass = String(process.env.SMTP_PASS ?? '').replace(/\s+/g, '').trim();
  const from = String(process.env.SMTP_FROM ?? '').trim() || user;
  const to = String(process.env.TEST_EMAIL_TO ?? '').trim() || user;

  required('SMTP_HOST', host);
  required('SMTP_FROM (or SMTP_USER)', from);
  required('TEST_EMAIL_TO (or SMTP_USER)', to);

  const hasAnyAuth = Boolean(user || pass);
  const auth = hasAnyAuth ? { user, pass } : undefined;

  if (hasAnyAuth && (!user || !pass)) {
    throw new Error('SMTP auth appears incomplete: set both SMTP_USER and SMTP_PASS');
  }

  console.log('SMTP config (sanitized):', {
    host,
    port,
    secure,
    from,
    to,
    authUserSet: Boolean(user),
    authPassSet: Boolean(pass),
  });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  console.log('1) Verifying SMTP...');
  await transporter.verify();
  console.log('   ✅ SMTP verify OK');

  console.log('2) Sending test email...');
  const info = await transporter.sendMail({
    from,
    to,
    subject: 'CYSTECH2K26 SMTP Test',
    text: `SMTP test email sent at ${new Date().toISOString()}`,
  });

  console.log('   ✅ Sent. messageId:', info.messageId);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ SMTP test failed:', err?.message || err);
  process.exit(1);
});

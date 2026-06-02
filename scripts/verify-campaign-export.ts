import fetch from 'node-fetch';

async function verifyExport(url: string, token: string) {
  const res = await fetch(`${url}?token=${token}`);
  if (!res.ok) throw new Error(`Export request failed: ${res.status}`);
  const body = await res.json();
  const { campaigns } = body;

  const mismatches: Array<{
    slug: string;
    noticeCount: number;
    actualNotices: number;
  }> = [];

  for (const c of campaigns) {
    // naive checks: noticeCount vs length of fetched related arrays if present
    const noticeCount = c.noticeCount || 0;
    const actualNotices = Array.isArray(c.relatedDevelopmentNotices)
      ? c.relatedDevelopmentNotices.length
      : 0;
    if (noticeCount !== actualNotices) {
      mismatches.push({ slug: c.slug, noticeCount, actualNotices });
    }
  }

  return { total: campaigns.length, mismatches };
}

if (require.main === module) {
  const [, , url, token] = process.argv;
  if (!url || !token) {
    console.error('Usage: node verify-campaign-export.ts <export-url> <token>');
    process.exit(2);
  }

  verifyExport(url, token)
    .then((r) => {
      console.log('Export verification result:', r);
    })
    .catch((err) => {
      console.error('Verification failed:', err);
      process.exit(1);
    });
}

/*
Simple verification script for campaign export JSON.
Usage:
  node scripts/verify-campaign-export.js https://your-site/api/campaigns/export <TOKEN>

Checks per-campaign:
- deliverableProgress consistency
- opportunityCount >= relatedOpportunities.length
- developmentNoticeCount >= relatedDevelopmentNotices.length
- verificationCount >= verifications.length

Exits with code 0 on success, 2 when issues found.
*/

const [, , url, token] = process.argv;
if (!url || !token) {
  console.error(
    'Usage: node scripts/verify-campaign-export.js <EXPORT_URL> <TOKEN>'
  );
  process.exit(1);
}

async function main() {
  try {
    const fullUrl = url.includes('?')
      ? `${url}&token=${token}`
      : `${url}?token=${token}`;
    const res = await fetch(fullUrl);
    if (!res.ok) {
      console.error('Failed to fetch export:', res.status, res.statusText);
      process.exit(2);
    }
    const data = await res.json();
    const campaigns = data.campaigns || [];
    console.log(
      `Fetched ${campaigns.length} campaigns (exportedAt=${data.exportedAt})`
    );

    let issues = 0;
    for (const c of campaigns) {
      issues += checkDeliverableProgress(c);
      issues += checkRelatedCounts(c);
    }

    if (issues === 0) {
      console.log('All checks passed');
      process.exit(0);
    }
    console.error(`${issues} issues found`);
    process.exit(2);
  } catch (err) {
    console.error('Error during verification:', err);
    process.exit(2);
  }
}

function checkDeliverableProgress(c) {
  const id = c.slug || c._id || '(unknown)';
  const total =
    typeof c.totalDeliverables === 'number' ? c.totalDeliverables : null;
  const certifiedCount = Array.isArray(c.deliverablesCertified)
    ? c.deliverablesCertified.length
    : 0;
  const deliverablesFallbackCount = Array.isArray(c.deliverables)
    ? c.deliverables.length
    : 0;
  const usedCount = Math.max(certifiedCount, deliverablesFallbackCount);
  const expectedProgress =
    total && total > 0 ? Math.round((usedCount / total) * 100) : null;
  if (expectedProgress !== c.deliverableProgress) {
    console.warn(
      `DELIVERABLE_PROGRESS_MISMATCH: ${id} expected=${expectedProgress} exported=${c.deliverableProgress}`
    );
    return 1;
  }
  return 0;
}

function checkRelatedCounts(c) {
  const id = c.slug || c._id || '(unknown)';
  let issues = 0;
  if (
    Array.isArray(c.relatedOpportunities) &&
    typeof c.opportunityCount === 'number'
  ) {
    if (c.opportunityCount < c.relatedOpportunities.length) {
      console.warn(
        `OPPORTUNITY_COUNT_MISMATCH: ${id} opportunityCount=${c.opportunityCount} relatedOpportunities=${c.relatedOpportunities.length}`
      );
      issues++;
    }
  }
  if (
    Array.isArray(c.relatedDevelopmentNotices) &&
    typeof c.developmentNoticeCount === 'number'
  ) {
    if (c.developmentNoticeCount < c.relatedDevelopmentNotices.length) {
      console.warn(
        `DEVELOPMENT_NOTICE_COUNT_MISMATCH: ${id} developmentNoticeCount=${c.developmentNoticeCount} relatedDevelopmentNotices=${c.relatedDevelopmentNotices.length}`
      );
      issues++;
    }
  }
  if (
    Array.isArray(c.verifications) &&
    typeof c.verificationCount === 'number'
  ) {
    if (c.verificationCount < c.verifications.length) {
      console.warn(
        `VERIFICATION_COUNT_MISMATCH: ${id} verificationCount=${c.verificationCount} verifications=${c.verifications.length}`
      );
      issues++;
    }
  }
  return issues;
}

main();

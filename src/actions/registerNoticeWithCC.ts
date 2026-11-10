'use server';

type RegisterParams = {
  sanityId: string;
  type: string;
  title: string;
  description?: string;
  isStatutory?: boolean;
  commentDeadline?: string | null;
  wardRef?: string | null;
  lat?: number | null;
  lng?: number | null;
};

type RegisterResult = { ccNoticeId: string } | { error: string };

async function callCCRegister(
  ccUrl: string,
  nodeApiKey: string,
  params: RegisterParams
): Promise<RegisterResult> {
  try {
    const res = await fetch(`${ccUrl}/api/notices/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${nodeApiKey}`,
      },
      body: JSON.stringify({
        nodeNoticeRef: params.sanityId,
        type: params.type,
        title: params.title,
        description: params.description ?? '',
        isStatutory: params.isStatutory ?? true,
        commentDeadline: params.commentDeadline ?? null,
        wardRef: params.wardRef ?? null,
        lat: params.lat ?? null,
        lng: params.lng ?? null,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        error:
          (body as { error?: string }).error ??
          `CC registration failed: HTTP ${res.status}`,
      };
    }
    const data = (await res.json()) as { ccNoticeId: string };
    return { ccNoticeId: data.ccNoticeId };
  } catch (err) {
    return {
      error: `CC request failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

async function patchSanityCcRef(
  sanityId: string,
  ccNoticeId: string,
  dataset: string,
  writeToken: string
): Promise<void> {
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-08-22';
  try {
    await fetch(`https://api.sanity.io/v${apiVersion}/data/mutate/${dataset}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${writeToken}`,
      },
      body: JSON.stringify({
        mutations: [
          { patch: { id: sanityId, set: { ccNoticeRef: ccNoticeId } } },
        ],
      }),
    });
  } catch (err) {
    console.error('[registerNoticeWithCC] Sanity patch error:', err);
  }
}

/**
 * Server action: register a Sanity developmentNotice with the Control Centre.
 * Idempotent — safe to call multiple times for the same notice.
 * Patches ccNoticeRef back onto the Sanity document on success.
 * Never called from the browser.
 */
export async function registerNoticeWithCC(
  params: RegisterParams
): Promise<RegisterResult> {
  const ccUrl = process.env.CONTROL_CENTRE_URL;
  const nodeApiKey = process.env.INTELLIGENCE_API_KEY;
  const sanityWriteToken = process.env.SANITY_API_WRITE_TOKEN;
  const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!ccUrl || !nodeApiKey || !sanityWriteToken || !sanityDataset) {
    return {
      error: 'Missing required environment variables for CC integration',
    };
  }

  const result = await callCCRegister(ccUrl, nodeApiKey, params);
  if ('error' in result) return result;

  await patchSanityCcRef(
    params.sanityId,
    result.ccNoticeId,
    sanityDataset,
    sanityWriteToken
  );
  return result;
}

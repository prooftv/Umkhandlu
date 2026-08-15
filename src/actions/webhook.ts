import 'server-only';

import { client } from '@/lib/sanity/client/client';
import { NODE_ID } from '@/lib/siteConfig';

type WebhookSettings = {
  webhookUrl?: string;
  webhookPublicComment?: string;
};

let cachedSettings: WebhookSettings | null = null;

async function getWebhookSettings(): Promise<WebhookSettings> {
  if (cachedSettings !== null) return cachedSettings;

  try {
    const result = await client.fetch<WebhookSettings>(
      `*[_type == "settings"][0]{ webhookUrl, webhookPublicComment }`
    );
    cachedSettings = result ?? {};
    return cachedSettings;
  } catch {
    return {};
  }
}

export async function sendToWebhook(
  type: 'contact' | 'subscribe' | 'public_comment',
  data: Record<string, unknown>
): Promise<boolean> {
  const settings = await getWebhookSettings();

  // public_comment routes to webhookPublicComment, falls back to webhookUrl
  const url =
    type === 'public_comment'
      ? (settings.webhookPublicComment || settings.webhookUrl || null)
      : (settings.webhookUrl || null);

  if (!url) {
    console.log(`[webhook] No webhook configured for type: ${type}`);
    return true;
  }

  // For public_comment, map the governance node payload to the Edge Function contract.
  // PII fields (name, contact, comment) pass through transiently — the Edge Function discards them.
  const body =
    type === 'public_comment'
      ? {
          node_id: NODE_ID,
          sanity_id: data.noticeId,
          sanity_type: 'notice',
          response_type: data.commentType,
          relationship: data.relationship,
          popiaConsent: data.popiaConsent,
          // PII fields forwarded transiently for any upstream validation — not persisted by Edge Function
          name: data.name,
          contact: data.contact,
          comment: data.comment,
        }
      : { type, timestamp: new Date().toISOString(), ...data };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.ok;
  } catch (_error) {
    console.error('[webhook] Webhook delivery failed');
    return false;
  }
}

import 'server-only';

import { client } from '@/lib/sanity/client/client';

let cachedWebhookUrl: string | null = null;

async function getWebhookUrl(): Promise<string | null> {
  if (cachedWebhookUrl !== null) return cachedWebhookUrl || null;

  try {
    const result = await client.fetch<{ webhookUrl?: string }>(
      `*[_type == "settings"][0]{ webhookUrl }`
    );
    cachedWebhookUrl = result?.webhookUrl || '';
    return cachedWebhookUrl || null;
  } catch {
    return null;
  }
}

export async function sendToWebhook(
  type: 'contact' | 'subscribe',
  data: Record<string, unknown>
): Promise<boolean> {
  const url = await getWebhookUrl();

  if (!url) {
    console.log(`[${type}] No webhook configured. Data:`, data);
    return true;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        timestamp: new Date().toISOString(),
        ...data,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error(`[${type}] Webhook delivery failed:`, error);
    return false;
  }
}

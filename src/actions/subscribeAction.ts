'use server';

import * as v from 'valibot';
import type { ActionResponse } from './types';
import { sendToWebhook } from './webhook';

const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Please enter your email.'),
  v.email('The email is badly formatted.')
);

export const subscribeAction = async (
  formData: FormData
): Promise<ActionResponse> => {
  'use server';

  try {
    const email = v.parse(EmailSchema, formData.get('email'));

    const sent = await sendToWebhook('subscribe', { email });

    if (!sent) {
      return { status: 'error', error: 'Failed to subscribe.' };
    }

    return { status: 'success', error: null };
  } catch (error: unknown) {
    if (v.isValiError(error)) {
      return { status: 'error', error: error.message };
    }
    return { status: 'error', error: 'An unknown error occurred.' };
  }
};

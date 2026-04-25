'use server';

import * as v from 'valibot';
import type { ActionResponse } from './types';
import { sendToWebhook } from './webhook';

const ContactSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty('Name is required.')),
  email: v.pipe(
    v.string(),
    v.nonEmpty('Email is required.'),
    v.email('Invalid email.')
  ),
  message: v.pipe(
    v.string(),
    v.nonEmpty('Message is required.'),
    v.minLength(10, 'Message too short.')
  ),
});

export const contactAction = async (
  formData: FormData
): Promise<ActionResponse> => {
  'use server';

  try {
    const data = v.parse(ContactSchema, {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    });

    const sent = await sendToWebhook('contact', data);

    if (!sent) {
      return { status: 'error', error: 'Failed to send message.' };
    }

    return { status: 'success', error: null };
  } catch (error: unknown) {
    if (v.isValiError(error)) {
      return { status: 'error', error: error.message };
    }
    return { status: 'error', error: 'An unknown error occurred.' };
  }
};

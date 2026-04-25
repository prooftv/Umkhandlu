'use server';

import * as v from 'valibot';
import type { ActionResponse } from './types';

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

    // TODO: Integrate with email service, n8n webhook, or database
    console.log('Contact form submission:', data);

    return { status: 'success', error: null };
  } catch (error: unknown) {
    if (v.isValiError(error)) {
      return { status: 'error', error: error.message };
    }
    return { status: 'error', error: 'An unknown error occurred.' };
  }
};

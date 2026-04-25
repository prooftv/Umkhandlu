'use client';

import { useActionState } from 'react';
import { subscribeAction } from '@/actions/subscribeAction';
import type { ActionResponse } from '@/actions/types';
import { Button } from '@/components/ui/Button';

export default function FooterNewsletter() {
  const [state, formAction, pending] = useActionState<
    Partial<ActionResponse>,
    FormData
  >((_state, formData) => subscribeAction(formData), {});

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
      <p className="text-sm mb-4">
        Stay updated with our latest news and offers.
      </p>
      <form className="flex" action={formAction}>
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          id="footer-email"
          name="email"
          placeholder="Enter your email"
          className="px-3 py-2 w-full text-sm bg-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <Button
          type="submit"
          className="py-2 h-auto rounded-tl-none rounded-bl-none"
          disabled={pending}
        >
          {pending ? '...' : 'Subscribe'}
        </Button>
      </form>
      {!pending && state.status === 'success' && (
        <p className="text-green-600 text-xs mt-2">Subscribed!</p>
      )}
      {!pending && state.status === 'error' && (
        <p className="text-red-600 text-xs mt-2">{state.error}</p>
      )}
    </div>
  );
}

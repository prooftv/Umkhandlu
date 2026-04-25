'use client';

import { useActionState } from 'react';
import { contactAction } from '@/actions/contactAction';
import type { ActionResponse } from '@/actions/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type Props = {
  section: {
    heading?: string;
    description?: string;
    showMap?: boolean;
    mapEmbedUrl?: string;
  };
};

export default function ContactForm({ section }: Props) {
  const { heading, description, showMap, mapEmbedUrl } = section;

  const [state, formAction, pending] = useActionState<
    Partial<ActionResponse>,
    FormData
  >((_state, formData) => contactAction(formData), {});

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
            {description && (
              <p className="text-xl text-gray-600">{description}</p>
            )}
          </div>

          <div
            className={`grid ${showMap && mapEmbedUrl ? 'md:grid-cols-2' : 'max-w-xl mx-auto'} gap-8`}
          >
            <form action={formAction} className="space-y-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                disabled={pending}
              >
                {pending ? 'Sending...' : 'Send Message'}
              </Button>

              {!pending && state.status === 'success' && (
                <Badge
                  variant="default"
                  className="text-white bg-green-500 w-full justify-center py-2"
                >
                  Message sent successfully
                </Badge>
              )}
              {!pending && state.status === 'error' && (
                <Badge
                  variant="default"
                  className="text-white bg-red-500 w-full justify-center py-2"
                >
                  {state.error}
                </Badge>
              )}
            </form>

            {showMap && mapEmbedUrl && (
              <div className="rounded-xl overflow-hidden h-80 md:h-full min-h-[320px]">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location map"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

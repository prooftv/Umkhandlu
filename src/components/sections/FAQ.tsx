'use client';

import type { PortableTextBlock } from 'next-sanity';
import { useState } from 'react';
import PortableText from '@/components/modules/PortableText';

type FaqItem = {
  _key: string;
  question: string;
  answer: PortableTextBlock[];
};

type Props = {
  section: {
    heading?: string;
    items?: FaqItem[];
  };
};

export default function FAQ({ section }: Props) {
  const { heading, items } = section;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items?.length) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {heading}
          </h2>
        )}
        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item._key}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-gray-50 transition-colors"
                >
                  {item.question}
                  <span className="text-xl ml-4 shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-gray-600">
                    <PortableText value={item.answer} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import PublicCommentForm from '@/components/modules/PublicCommentForm';

type Props = {
  _id: string;
  title: string;
  deadline: string;
  contact: string;
};

export default function ParticipationAction({
  _id,
  title,
  deadline,
  contact,
}: Props) {
  const [open, setOpen] = useState(false);

  const deadlineStr = new Date(deadline).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 mb-1">
        Public Participation Open
      </p>
      <p className="text-sm font-semibold text-gray-800 mb-0.5">{title}</p>
      <p className="text-xs text-amber-700 mb-3">
        Comment deadline: <span className="font-medium">{deadlineStr}</span>
      </p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors"
        >
          Submit Comment or Objection
        </button>
      ) : (
        <div className="mt-2">
          <PublicCommentForm noticeId={_id} noticeTitle={title} />
          <p className="text-xs text-gray-500 mt-3">
            Or submit directly to:{' '}
            <span className="font-medium">{contact}</span>
          </p>
        </div>
      )}
    </div>
  );
}

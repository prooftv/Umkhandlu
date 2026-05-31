'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { submitComment } from './submitComment';

type Props = {
  noticeId: string;
  noticeTitle: string;
};

export default function PublicCommentForm({ noticeId, noticeTitle }: Props) {
  const [state, action, pending] = useActionState(submitComment, {
    success: false,
    message: '',
  });

  if (state.success) {
    return (
      <div className="p-6 bg-green-50 rounded-xl border border-green-200">
        <p className="text-green-800 font-medium">
          ✓ Your comment has been submitted successfully.
        </p>
        <p className="text-sm text-green-600 mt-1">
          It will be forwarded to the relevant authority for consideration.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="noticeId" value={noticeId} />
      <input type="hidden" name="noticeTitle" value={noticeTitle} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div>
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email or Phone *
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="relationship"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Relationship to Site
        </label>
        <select
          id="relationship"
          name="relationship"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">Select...</option>
          <option value="resident">Resident / Neighbour</option>
          <option value="landowner">Landowner</option>
          <option value="business">Business Owner</option>
          <option value="community">Community Member</option>
          <option value="organisation">Organisation / NGO</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="commentType"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Type of Submission *
        </label>
        <select
          id="commentType"
          name="commentType"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="comment">Comment</option>
          <option value="objection">Objection</option>
          <option value="support">Support</option>
          <option value="question">Question</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Your Comment / Objection *
        </label>
        <textarea
          id="comment"
          name="comment"
          required
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="State your comment, objection, or question regarding this proposed development..."
        />
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? 'Submitting...' : 'Submit Comment'}
      </Button>

      <p className="text-xs text-gray-400">
        Your submission will be forwarded to the applicant and/or relevant
        authority. Personal details are shared only with the parties handling
        this application.
      </p>
    </form>
  );
}

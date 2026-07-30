'use server';

import { literal, minLength, object, parse, pipe, string } from 'valibot';
import { sendToWebhook } from '@/actions/webhook';

const CommentSchema = object({
  noticeId: string(),
  noticeTitle: string(),
  name: pipe(string(), minLength(2, 'Name is required')),
  contact: pipe(string(), minLength(3, 'Contact is required')),
  relationship: string(),
  commentType: string(),
  comment: pipe(
    string(),
    minLength(10, 'Comment must be at least 10 characters')
  ),
  popia: literal('on'),
});

type State = { success: boolean; message: string };

export async function submitComment(
  _prev: State,
  formData: FormData
): Promise<State> {
  const raw = {
    noticeId: formData.get('noticeId') as string,
    noticeTitle: formData.get('noticeTitle') as string,
    name: formData.get('name') as string,
    contact: formData.get('contact') as string,
    relationship: formData.get('relationship') as string,
    commentType: formData.get('commentType') as string,
    comment: formData.get('comment') as string,
    popia: formData.get('popia') as string,
  };

  try {
    const { popia: _, ...data } = parse(CommentSchema, raw);
    await sendToWebhook('public_comment', { ...data, popiaConsent: true });
    return { success: true, message: 'Comment submitted successfully.' };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : 'Failed to submit comment.';
    return { success: false, message: msg };
  }
}

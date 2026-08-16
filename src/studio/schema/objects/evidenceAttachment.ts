import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'evidenceAttachment',
  title: 'Evidence Attachment',
  type: 'file',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Document Title',
      validation: (rule) => rule.required(),
    }),
  ],
});

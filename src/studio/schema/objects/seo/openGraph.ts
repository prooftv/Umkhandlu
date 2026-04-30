import { defineField } from 'sanity';
import SEODescription from '@/studio/components/SEODescription';
import SEOTitle from '@/studio/components/SEOTitle';

export default defineField({
  name: 'openGraph',
  title: 'Open Graph',
  type: 'object',
  description:
    'Control how your content appears when shared on social media platforms (e.g., Facebook, LinkedIn) or in messaging apps (e.g., Slack, WhatsApp).',
  fields: [
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { aiAssist: { imageDescriptionField: 'alt' } },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        }),
      ],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.max(60).warning(),
      components: {
        input: SEOTitle,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      validation: (rule) => rule.max(160).warning(),
      components: {
        input: SEODescription,
      },
    }),
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
    }),
  ],
});

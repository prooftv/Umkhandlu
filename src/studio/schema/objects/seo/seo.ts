import { defineField, defineType } from 'sanity';
import SEODescription from '@/studio/components/SEODescription';
import SEOTitle from '@/studio/components/SEOTitle';

export default defineType({
  title: 'SEO & Metadata',
  name: 'seoMetaFields',
  options: {
    collapsible: true,
  },
  type: 'object',
  fields: [
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      initialValue: false,
      description:
        "If checked, this document won't be indexed by search engines and it won't render in the sitemap file",
    }),
    defineField({
      name: 'metaTitle',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.max(60).warning(),
      components: {
        input: SEOTitle,
      },
    }),
    defineField({
      name: 'metaDescription',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).warning(),
      components: {
        input: SEODescription,
      },
      options: { aiAssist: { translateAction: true } },
    }),
    defineField({
      name: 'metaImage',
      title: 'Meta Image',
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
      name: 'seoKeywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'openGraph',
      title: 'Open Graph',
      type: 'openGraph',
    }),
    defineField({
      name: 'additionalMetaTags',
      title: 'Additional Meta Tags',
      type: 'array',
      of: [{ type: 'metaTag' }],
    }),
    defineField({
      name: 'twitter',
      title: 'X.com',
      type: 'twitter',
    }),
  ],
});

import { CogIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'branding', title: 'Branding' },
    { name: 'social', title: 'Social & Contact' },
    { name: 'analytics', title: 'Analytics' },
  ],
  fields: [
    // General
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      group: 'general',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      description: 'Used for the default meta description and footer.',
      type: 'text',
      group: 'general',
    }),
    defineField({
      name: 'menu',
      type: 'array',
      of: [{ type: 'menuItem' }],
      description: 'Main navigation menu.',
      group: 'general',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default Open Graph Image',
      type: 'image',
      description:
        'Fallback image for social sharing when pages have no image set.',
      group: 'general',
      options: {
        hotspot: true,
        aiAssist: { imageDescriptionField: 'alt' },
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              if (
                (context.document?.ogImage as { asset?: { _ref?: string } })
                  ?.asset?._ref &&
                !alt
              ) {
                return 'Required';
              }
              return true;
            }),
        }),
      ],
    }),

    // Social & Contact
    defineField({
      name: 'primaryColor',
      title: 'Primary Brand Color',
      type: 'string',
      group: 'branding',
      description:
        'Hex color code (e.g. #ec4899 for pink, #16a34a for green). Used for buttons, links, accents.',
      initialValue: '#ec4899',
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Brand Color',
      type: 'string',
      group: 'branding',
      description:
        'Hex color code (e.g. #3b82f6 for blue, #f59e0b for amber). Used for gradients and secondary elements.',
      initialValue: '#3b82f6',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'social',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
      group: 'social',
    }),
    defineField({
      name: 'address',
      title: 'Physical Address',
      type: 'text',
      rows: 3,
      group: 'social',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      group: 'social',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'twitter', title: 'X / Twitter URL', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp Number',
          type: 'string',
          description: 'International format, e.g. +27612345678',
        }),
      ],
    }),

    // Analytics
    defineField({
      name: 'gtmId',
      title: 'Google Tag Manager ID',
      type: 'string',
      description: 'e.g. GTM-XXXXXXX — leave empty to disable.',
      group: 'analytics',
    }),
    defineField({
      name: 'webhookUrl',
      title: 'Form Webhook URL',
      type: 'url',
      description:
        'Webhook endpoint for contact/subscribe form submissions (e.g. n8n, Make, Zapier). Leave empty to disable.',
      group: 'analytics',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Settings' };
    },
  },
});

import { PlayIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'embed',
  title: 'Video / Embed',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Embed URL',
      type: 'url',
      description:
        'YouTube embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID) or any iframe-compatible URL.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: '16:9 (Video)', value: '16/9' },
          { title: '4:3', value: '4/3' },
          { title: '1:1 (Square)', value: '1/1' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '16/9',
    }),
  ],
  preview: {
    select: { title: 'heading', url: 'url' },
    prepare({ title, url }) {
      return {
        title: title || 'Embed',
        subtitle: url || 'No URL set',
      };
    },
  },
});

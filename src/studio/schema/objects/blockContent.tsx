import { ImageIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Code', value: 'code' },
          { title: 'Strike', value: 'strike-through' },
          {
            title: 'Sup',
            value: 'sup',
            icon: () => (
              <div>
                x<sup>2</sup>
              </div>
            ),
            component: ({ children }) => <sup>{children}</sup>,
          },
          {
            title: 'Sub',
            value: 'sub',
            icon: () => (
              <div>
                x<sub>2</sub>
              </div>
            ),
            component: ({ children }) => <sub>{children}</sub>,
          },
        ],
        annotations: [
          {
            name: 'customLink',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'customLink',
                type: 'link',
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        },
      ],
    }),
  ],
});

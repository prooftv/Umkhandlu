import { UserIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import StudioNote from '../../components/StudioNote';

const leadershipTypes = ['inkosi', 'induna', 'council'];
const communityTypes = ['youth', 'community'];

export default defineType({
  name: 'person',
  title: 'People',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: (doc) => `${doc?.firstName}-${doc?.lastName}`.toLowerCase(),
        maxLength: 96,
      },
    }),
    defineField({
      name: 'image',
      title: 'Picture',
      type: 'image',
      description: 'Profile photo. Recommended: 800×800px square, JPG or PNG.',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        }),
      ],
      options: {
        hotspot: true,
        aiAssist: { imageDescriptionField: 'alt' },
      },
    }),
    defineField({
      name: 'personType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Inkosi (Chief)', value: 'inkosi' },
          { title: 'Induna (Headman)', value: 'induna' },
          { title: 'Council Member', value: 'council' },
          { title: 'Youth Representative', value: 'youth' },
          { title: 'Community Member', value: 'community' },
          { title: 'Author', value: 'author' },
        ],
      },
      initialValue: 'council',
    }),
    defineField({
      name: 'leadershipNote',
      title: 'Leadership Guide',
      type: 'string',
      hidden: ({ parent }) =>
        !leadershipTypes.includes(parent?.personType ?? ''),
      components: {
        field: () =>
          StudioNote({
            title: 'Leadership profile',
            description:
              'This person appears on the Leadership page and Team Grid sections. Izinduna are also linked to Area pages via Directory Listings. Set the Role field to their governance title.',
          }),
      },
    }),
    defineField({
      name: 'communityNote',
      title: 'Community Guide',
      type: 'string',
      hidden: ({ parent }) =>
        !communityTypes.includes(parent?.personType ?? ''),
      components: {
        field: () =>
          StudioNote({
            title: 'Community profile',
            description:
              'Add skills and portfolio photos to showcase this person\u2019s trades or work. Useful for connecting community members with opportunities.',
          }),
      },
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'e.g. Inkosi, Council Member, Youth Coordinator, Sponsor',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'string',
      description: 'e.g. Unami Foundation, Ingonyama Trust, School name',
      hidden: ({ parent }) => parent?.personType === 'author',
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Skills or trades (e.g. Builder, Mechanic, Farmer, Designer)',
      hidden: ({ parent }) =>
        leadershipTypes.includes(parent?.personType ?? '') ||
        parent?.personType === 'author',
    }),
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'blockContent',
    }),
    defineField({
      name: 'gallery',
      title: 'Portfolio / Gallery',
      type: 'array',
      description:
        'Photos of work, projects, or achievements. Useful for community members showcasing skills.',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            aiAssist: { imageDescriptionField: 'alt' },
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        },
      ],
      hidden: ({ parent }) =>
        leadershipTypes.includes(parent?.personType ?? '') ||
        parent?.personType === 'author',
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'role',
      image: 'image',
    },
    prepare({ firstName, lastName, role, image }) {
      return {
        title: `${firstName} ${lastName}`,
        subtitle: role || 'Person',
        media: image,
      };
    },
  },
});

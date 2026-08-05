import { UsersIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import StudioNote from '../../components/StudioNote';

export default defineType({
  name: 'operatorProfile',
  title: 'Operator Profiles',
  icon: UsersIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'operatorRole',
      title: 'Platform Role',
      type: 'string',
      options: {
        list: [
          { title: 'Council Secretary', value: 'council-secretary' },
          { title: 'Youth Representative', value: 'youth-rep' },
          { title: 'Induna (Area Rep)', value: 'induna-rep' },
          { title: 'Council Operating Partner', value: 'operating-partner' },
          { title: 'PMU / Engineer Rep', value: 'pmu-rep' },
          { title: 'Platform Operator', value: 'platform-operator' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'organisation',
      title: 'Organisation',
      type: 'string',
      description:
        'e.g. Khathide Traditional Council, Unami Foundation, ABC Consulting Engineers',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sanityUserId',
      title: 'Sanity User ID',
      type: 'string',
      description:
        'From Sanity Studio → Manage → Members. Used to attribute activity in the admin dashboard audit log. Format: e.g. p_abc123xyz',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck when operator leaves or access is revoked.',
    }),
    defineField({
      name: 'assignedSince',
      title: 'Assigned Since',
      type: 'date',
    }),
    defineField({
      name: 'assignedUntil',
      title: 'Assigned Until',
      type: 'date',
      description: 'Leave blank for ongoing assignments.',
    }),
    defineField({
      name: 'privateNote',
      title: 'Private Fields',
      type: 'string',
      components: {
        field: () =>
          StudioNote({
            title: 'Contact details are private',
            description:
              'Email and phone are stored here for internal reference only. They are never returned by the Intelligence API or shown on the public site.',
          }),
      },
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
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 2,
      description: 'Internal notes — training status, access scope, handover.',
    }),
  ],
  orderings: [
    {
      title: 'Role',
      name: 'roleAsc',
      by: [{ field: 'operatorRole', direction: 'asc' }],
    },
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      name: 'name',
      operatorRole: 'operatorRole',
      organisation: 'organisation',
      active: 'active',
    },
    prepare({ name, operatorRole, organisation, active }) {
      const roleLabels: Record<string, string> = {
        'council-secretary': 'Council Secretary',
        'youth-rep': 'Youth Rep',
        'induna-rep': 'Induna Rep',
        'operating-partner': 'Operating Partner',
        'pmu-rep': 'PMU / Engineer',
        'platform-operator': 'Platform Operator',
      };
      return {
        title: `${active === false ? '⚫ ' : ''}${name}`,
        subtitle: `${roleLabels[operatorRole] ?? operatorRole} — ${organisation}`,
      };
    },
  },
});

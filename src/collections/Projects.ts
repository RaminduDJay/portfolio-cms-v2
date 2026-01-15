import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'year', 'client'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      validate: (val) => {
        if (!val || val.length < 3) return 'Title must be at least 3 characters'
        if (val.length > 100) return 'Title must be less than 100 characters'
        return true
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      validate: (val) => {
        if (!val) return 'Slug is required'
        if (!/^[a-z0-9-]+$/.test(val)) return 'Slug must contain only lowercase letters, numbers, and hyphens'
        return true
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'img',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'text',
      required: true,
    },
    {
      name: 'year',
      type: 'text',
      required: true,
      validate: (val) => {
        if (!val) return 'Year is required'
        if (!/^\d{4}$/.test(val)) return 'Year must be a 4-digit number'
        const year = parseInt(val)
        if (year < 2020 || year > new Date().getFullYear() + 1) return 'Year must be between 2020 and next year'
        return true
      },
    },
    {
      name: 'client',
      type: 'text',
      required: true,
    },
    {
      name: 'toolsandtechnologies',
      type: 'text',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      validate: (val) => {
        if (val && !/^https?:\/\/.+/.test(val)) return 'Link must be a valid URL starting with http:// or https://'
        return true
      },
    },
    {
      name: 'content',
      type: 'group',
      fields: [
        {
          name: 'paragraph1',
          type: 'richText',
          required: true,
        },
        {
          name: 'paragraph2',
          type: 'richText',
          required: true,
        },
        {
          name: 'paragraph3',
          type: 'richText',
        },
        {
          name: 'paragraph4',
          type: 'richText',
        },
        {
          name: 'paragraph5',
          type: 'richText',
        },
        {
          name: 'paragraph6',
          type: 'richText',
        },
      ],
    },
    {
      name: 'images',
      type: 'group',
      fields: [
        {
          name: 'imgdt1',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'imgdt2',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'imgdt3',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'imgdt4',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'imgdt5',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'imgdt6',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'imgdt7',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'popupImages',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'popupVideos',
      type: 'array',
      fields: [
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
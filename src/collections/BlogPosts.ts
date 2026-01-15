import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'date', 'category'],
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
      name: 'author',
      type: 'text',
      required: true,
      defaultValue: 'Geenoth',
      validate: (val) => {
        if (!val || val.length < 2) return 'Author name must be at least 2 characters'
        return true
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'group',
      fields: [
        {
          name: 'paragraph_1',
          type: 'richText',
          required: true,
        },
        {
          name: 'paragraph_2',
          type: 'richText',
          required: true,
        },
        {
          name: 'paragraph_3',
          type: 'richText',
          required: true,
        },
      ],
    },
    {
      name: 'points',
      type: 'array',
      minRows: 4,
      maxRows: 4,
      fields: [
        {
          name: 'point',
          type: 'richText',
          required: true,
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
      ],
    },
    {
      name: 'tags',
      type: 'array',
      minRows: 5,
      maxRows: 5,
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
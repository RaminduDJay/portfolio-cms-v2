# Blog Migration to Payload CMS

This document outlines the migration of static blog content from `geenoth-portfolio/util/blog.json` to the dynamic Payload CMS.

## Setup Instructions

### 1. Environment Configuration

Update your `.env` file with Cloudinary credentials:

```env
# Cloudinary Configuration (Free Plan)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Database Setup

Ensure MongoDB is running locally:
```bash
# Start MongoDB service
mongod
```

### 3. Install Dependencies

Dependencies are already installed:
- `@payloadcms/plugin-cloud-storage`
- `cloudinary`

## Migration Process

### Step 1: Start the CMS
```bash
pnpm dev
```

### Step 2: Create Admin User
1. Navigate to `http://localhost:3000/admin`
2. Create your admin account

### Step 3: Run Migration
```bash
pnpm migrate:complete
```

This will:
- Upload all blog images to Cloudinary
- Create media records in Payload
- Import all blog posts with proper relationships

## Collection Structure

### BlogPosts Collection
- **title**: Blog post title
- **slug**: URL-friendly identifier
- **img**: Main featured image (Media relation)
- **category**: Blog category
- **author**: Post author (default: "Geenoth")
- **date**: Publication date
- **content**: Rich text content (3 paragraphs)
- **points**: Array of 4 key points
- **images**: Additional detail images (3 images)
- **tags**: Array of 5 tags

## Features Enabled

✅ **Full CRUD Operations**: Create, read, update, delete blog posts via admin UI
✅ **Rich Text Editor**: Lexical editor for content paragraphs and points
✅ **Image Management**: Cloudinary integration for optimized image delivery
✅ **Slug Generation**: Automatic URL-friendly slug creation
✅ **Media Relations**: Proper image relationships with alt text
✅ **Validation**: Required fields and data validation
✅ **Admin Interface**: User-friendly content management interface

## API Endpoints

After migration, your blog posts will be available via:

- **GET** `/api/blog-posts` - List all blog posts
- **GET** `/api/blog-posts/:id` - Get specific blog post
- **POST** `/api/blog-posts` - Create new blog post (admin only)
- **PUT** `/api/blog-posts/:id` - Update blog post (admin only)
- **DELETE** `/api/blog-posts/:id` - Delete blog post (admin only)

## Next Steps

1. **Configure Cloudinary**: Set up your free Cloudinary account and update environment variables
2. **Run Migration**: Execute the migration script to import existing data
3. **Test Admin Interface**: Verify all blog posts are properly imported
4. **Update Frontend**: Modify your portfolio site to fetch data from the CMS API instead of the static JSON file

## Cloudinary Free Plan Limits

- 25 GB storage
- 25 GB monthly bandwidth
- 1,000 transformations per month
- Perfect for this blog use case with image optimization

The migration preserves all existing blog content while enabling dynamic management through the Payload CMS admin interface.
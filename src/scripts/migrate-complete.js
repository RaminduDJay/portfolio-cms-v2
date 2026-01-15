import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { uploadBlogImages } from '../utils/cloudinary.ts'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env' })

const blogData = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), '../geenoth-portfolio/util/blog.json'),
    'utf8'
  )
)

async function migrateBlogData() {
  console.log('Environment check:', {
    secret: process.env.PAYLOAD_SECRET ? 'Set' : 'Missing',
    db: process.env.DATABASE_URL ? 'Set' : 'Missing'
  })
  
  const payload = await getPayload({ config })

  console.log('Starting blog migration...')
  
  // Step 1: Upload images to Cloudinary
  console.log('📤 Uploading images to Cloudinary...')
  await uploadBlogImages(blogData)

  // Step 2: Create media records in Payload
  console.log('📁 Creating media records...')
  const mediaMap = new Map()

  for (const blog of blogData) {
    try {
      // Create main image media record
      if (blog.img) {
        const mainMedia = await payload.create({
          collection: 'media',
          data: {
            alt: `${blog.title} - Main Image`,
            filename: blog.img,
            url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/geenoth-blog/blog-${blog.id}-main`,
          },
        })
        mediaMap.set(`${blog.id}-main`, mainMedia.id)
      }

      // Create detail image media records
      const detailImages = [blog.imgdt1, blog.imgdt2, blog.imgdt3].filter(Boolean)
      for (let i = 0; i < detailImages.length; i++) {
        const detailMedia = await payload.create({
          collection: 'media',
          data: {
            alt: `${blog.title} - Detail Image ${i + 1}`,
            filename: detailImages[i],
            url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/geenoth-blog/blog-${blog.id}-detail-${i + 1}`,
          },
        })
        mediaMap.set(`${blog.id}-detail-${i + 1}`, detailMedia.id)
      }
    } catch (error) {
      console.error(`❌ Failed to create media for: ${blog.title}`, error)
    }
  }

  // Step 3: Create blog posts
  console.log('📝 Creating blog posts...')
  
  for (const blog of blogData) {
    try {
      const blogPost = {
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
        author: blog.author,
        date: new Date(blog.date),
        img: mediaMap.get(`${blog.id}-main`),
        content: {
          paragraph_1: blog.pharagraph_1,
          paragraph_2: blog.pharagraph_2,
          paragraph_3: blog.pharagraph_3,
        },
        points: [
          { point: blog.point_1 },
          { point: blog.point_2 },
          { point: blog.point_3 },
          { point: blog.point_4 },
        ],
        images: {
          imgdt1: mediaMap.get(`${blog.id}-detail-1`),
          imgdt2: mediaMap.get(`${blog.id}-detail-2`),
          imgdt3: mediaMap.get(`${blog.id}-detail-3`),
        },
        tags: [
          { tag: blog.tag_1?.trim() },
          { tag: blog.tag_2?.trim() },
          { tag: blog.tag_3?.trim() },
          { tag: blog.tag_4?.trim() },
          { tag: blog.tag_5?.trim() },
        ].filter(tag => tag.tag),
      }

      await payload.create({
        collection: 'blog-posts',
        data: blogPost,
      })

      console.log(`✅ Migrated: ${blog.title}`)
    } catch (error) {
      console.error(`❌ Failed to migrate: ${blog.title}`, error)
    }
  }

  console.log('🎉 Migration completed successfully!')
  process.exit(0)
}

migrateBlogData().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
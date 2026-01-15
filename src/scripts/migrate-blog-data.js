import { getPayload } from 'payload'
import config from '../payload.config.js'
import fs from 'fs'
import path from 'path'

const blogData = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), '../geenoth-portfolio/util/blog.json'),
    'utf8'
  )
)

async function migrateBlogData() {
  const payload = await getPayload({ config })

  console.log('Starting blog data migration...')

  for (const blog of blogData) {
    try {
      // Transform the data to match our collection structure
      const blogPost = {
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
        author: blog.author,
        date: new Date(blog.date),
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
        tags: [
          { tag: blog.tag_1 },
          { tag: blog.tag_2 },
          { tag: blog.tag_3 },
          { tag: blog.tag_4 },
          { tag: blog.tag_5 },
        ],
      }

      // Create the blog post
      const result = await payload.create({
        collection: 'blog-posts',
        data: blogPost,
      })

      console.log(`✅ Migrated: ${blog.title}`)
    } catch (error) {
      console.error(`❌ Failed to migrate: ${blog.title}`, error)
    }
  }

  console.log('Migration completed!')
  process.exit(0)
}

migrateBlogData().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
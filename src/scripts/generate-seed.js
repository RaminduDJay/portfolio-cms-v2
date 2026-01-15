import fs from 'fs'
import path from 'path'

const blogData = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), '../geenoth-portfolio/util/blog.json'),
    'utf8'
  )
)

// Generate seed data for Payload
const seedData = {
  collections: {
    'blog-posts': blogData.map(blog => ({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      author: blog.author,
      date: new Date(blog.date).toISOString(),
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
        { tag: blog.tag_1?.trim() },
        { tag: blog.tag_2?.trim() },
        { tag: blog.tag_3?.trim() },
        { tag: blog.tag_4?.trim() },
        { tag: blog.tag_5?.trim() },
      ].filter(tag => tag.tag),
    }))
  }
}

// Write seed data
fs.writeFileSync(
  path.resolve(process.cwd(), 'seed-data.json'),
  JSON.stringify(seedData, null, 2)
)

console.log('✅ Seed data generated: seed-data.json')
console.log(`📊 Generated ${blogData.length} blog posts`)
console.log('🚀 Import this data through the Payload admin interface')
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const blogData = JSON.parse(
  fs.readFileSync('../geenoth-portfolio/util/blog.json', 'utf8')
)

async function migrate() {
  const client = new MongoClient(process.env.DATABASE_URL)
  await client.connect()
  const db = client.db()

  console.log('🚀 Starting migration...')

  for (const blog of blogData) {
    try {
      // Upload images to Cloudinary
      const imagesPath = '../geenoth-portfolio/public/assets/images'
      
      let mainImageId = null
      let detailImageIds = { imgdt1: null, imgdt2: null, imgdt3: null }

      // Upload main image
      if (blog.img && fs.existsSync(path.join(imagesPath, blog.img))) {
        const mainResult = await cloudinary.uploader.upload(path.join(imagesPath, blog.img), {
          public_id: `blog-${blog.id}-main`,
          folder: 'geenoth-blog'
        })
        
        const mediaDoc = await db.collection('media').insertOne({
          filename: blog.img,
          alt: `${blog.title} - Main Image`,
          url: mainResult.secure_url,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        mainImageId = mediaDoc.insertedId
        console.log(`✅ Uploaded main image: ${blog.img}`)
      }

      // Upload detail images
      for (const [key, filename] of Object.entries({ imgdt1: blog.imgdt1, imgdt2: blog.imgdt2, imgdt3: blog.imgdt3 })) {
        if (filename && fs.existsSync(path.join(imagesPath, filename))) {
          const result = await cloudinary.uploader.upload(path.join(imagesPath, filename), {
            public_id: `blog-${blog.id}-${key}`,
            folder: 'geenoth-blog'
          })
          
          const mediaDoc = await db.collection('media').insertOne({
            filename: filename,
            alt: `${blog.title} - ${key}`,
            url: result.secure_url,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          detailImageIds[key] = mediaDoc.insertedId
          console.log(`✅ Uploaded ${key}: ${filename}`)
        }
      }

      // Insert blog post
      await db.collection('blog-posts').insertOne({
        title: blog.title,
        slug: blog.slug,
        img: mainImageId,
        category: blog.category,
        author: blog.author,
        date: new Date(blog.date),
        content: {
          paragraph_1: {
            root: {
              children: [{
                children: [{ detail: 0, format: 0, mode: "normal", style: "", text: blog.pharagraph_1, type: "text", version: 1 }],
                direction: "ltr", format: "", indent: 0, type: "paragraph", version: 1
              }],
              direction: "ltr", format: "", indent: 0, type: "root", version: 1
            }
          },
          paragraph_2: {
            root: {
              children: [{
                children: [{ detail: 0, format: 0, mode: "normal", style: "", text: blog.pharagraph_2, type: "text", version: 1 }],
                direction: "ltr", format: "", indent: 0, type: "paragraph", version: 1
              }],
              direction: "ltr", format: "", indent: 0, type: "root", version: 1
            }
          },
          paragraph_3: {
            root: {
              children: [{
                children: [{ detail: 0, format: 0, mode: "normal", style: "", text: blog.pharagraph_3, type: "text", version: 1 }],
                direction: "ltr", format: "", indent: 0, type: "paragraph", version: 1
              }],
              direction: "ltr", format: "", indent: 0, type: "root", version: 1
            }
          },
        },
        points: [
          { point: {
            root: {
              children: [{
                children: [{ detail: 0, format: 0, mode: "normal", style: "", text: blog.point_1, type: "text", version: 1 }],
                direction: "ltr", format: "", indent: 0, type: "paragraph", version: 1
              }],
              direction: "ltr", format: "", indent: 0, type: "root", version: 1
            }
          }},
          { point: {
            root: {
              children: [{
                children: [{ detail: 0, format: 0, mode: "normal", style: "", text: blog.point_2, type: "text", version: 1 }],
                direction: "ltr", format: "", indent: 0, type: "paragraph", version: 1
              }],
              direction: "ltr", format: "", indent: 0, type: "root", version: 1
            }
          }},
          { point: {
            root: {
              children: [{
                children: [{ detail: 0, format: 0, mode: "normal", style: "", text: blog.point_3, type: "text", version: 1 }],
                direction: "ltr", format: "", indent: 0, type: "paragraph", version: 1
              }],
              direction: "ltr", format: "", indent: 0, type: "root", version: 1
            }
          }},
          { point: {
            root: {
              children: [{
                children: [{ detail: 0, format: 0, mode: "normal", style: "", text: blog.point_4, type: "text", version: 1 }],
                direction: "ltr", format: "", indent: 0, type: "paragraph", version: 1
              }],
              direction: "ltr", format: "", indent: 0, type: "root", version: 1
            }
          }},
        ],
        images: detailImageIds,
        tags: [
          { tag: blog.tag_1?.trim() },
          { tag: blog.tag_2?.trim() },
          { tag: blog.tag_3?.trim() },
          { tag: blog.tag_4?.trim() },
          { tag: blog.tag_5?.trim() },
        ].filter(tag => tag.tag),
        createdAt: new Date(),
        updatedAt: new Date()
      })

      console.log(`✅ Migrated: ${blog.title}`)
    } catch (error) {
      console.error(`❌ Failed: ${blog.title}`, error.message)
    }
  }

  await client.close()
  console.log('🎉 Migration completed!')
}

migrate().catch(console.error)
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

const projectData = JSON.parse(
  fs.readFileSync('../geenoth-portfolio/util/project.json', 'utf8')
)

function createLexicalContent(text) {
  return {
    root: {
      children: [{
        children: [{ detail: 0, format: 0, mode: "normal", style: "", text: text, type: "text", version: 1 }],
        direction: "ltr", format: "", indent: 0, type: "paragraph", version: 1
      }],
      direction: "ltr", format: "", indent: 0, type: "root", version: 1
    }
  }
}

async function migrateProjects() {
  const client = new MongoClient(process.env.DATABASE_URL)
  await client.connect()
  const db = client.db()

  console.log('🚀 Starting projects migration...')

  for (const project of projectData) {
    try {
      const imagesPath = '../geenoth-portfolio/public/assets/images'
      
      let mainImageId = null
      let detailImageIds = {}
      let popupImageIds = []

      // Upload main image
      if (project.img && fs.existsSync(path.join(imagesPath, project.img))) {
        const mainResult = await cloudinary.uploader.upload(path.join(imagesPath, project.img), {
          public_id: `project-${project.id}-main`,
          folder: 'geenoth-projects'
        })
        
        const mediaDoc = await db.collection('media').insertOne({
          filename: `proj-${project.id}-main-${Date.now()}`,
          alt: `${project.title} - Main Image`,
          url: mainResult.secure_url,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        mainImageId = mediaDoc.insertedId
        console.log(`✅ Uploaded main: ${project.img}`)
      }

      // Upload detail images
      for (let i = 1; i <= 7; i++) {
        const imgKey = `imgdt${i}`
        if (project[imgKey] && fs.existsSync(path.join(imagesPath, project[imgKey]))) {
          const result = await cloudinary.uploader.upload(path.join(imagesPath, project[imgKey]), {
            public_id: `project-${project.id}-${imgKey}`,
            folder: 'geenoth-projects'
          })
          
          const mediaDoc = await db.collection('media').insertOne({
            filename: `proj-${project.id}-${imgKey}-${Date.now()}`,
            alt: `${project.title} - ${imgKey}`,
            url: result.secure_url,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          detailImageIds[imgKey] = mediaDoc.insertedId
          console.log(`✅ Uploaded ${imgKey}: ${project[imgKey]}`)
        }
      }

      // Upload popup images
      if (project.popupImages && project.popupImages.length > 0) {
        for (const popupImg of project.popupImages) {
          if (fs.existsSync(path.join(imagesPath, popupImg))) {
            const result = await cloudinary.uploader.upload(path.join(imagesPath, popupImg), {
              public_id: `project-${project.id}-popup-${popupImageIds.length}`,
              folder: 'geenoth-projects'
            })
            
            const mediaDoc = await db.collection('media').insertOne({
              filename: `proj-${project.id}-popup-${Date.now()}-${Math.random()}`,
              alt: `${project.title} - Popup Image`,
              url: result.secure_url,
              createdAt: new Date(),
              updatedAt: new Date()
            })
            popupImageIds.push({ image: mediaDoc.insertedId })
            console.log(`✅ Uploaded popup: ${popupImg}`)
          }
        }
      }

      // Insert project
      await db.collection('projects').insertOne({
        title: project.title,
        slug: project.slug,
        img: mainImageId,
        category: project.category,
        year: project.year,
        client: project.client,
        toolsandtechnologies: project.toolsandtechnologies,
        link: project.link || '',
        content: {
          paragraph1: createLexicalContent(project.paragraph1),
          paragraph2: createLexicalContent(project.paragraph2),
          paragraph3: project.paragraph3 ? createLexicalContent(project.paragraph3) : null,
          paragraph4: project.paragraph4 ? createLexicalContent(project.paragraph4) : null,
          paragraph5: project.paragraph5 ? createLexicalContent(project.paragraph5) : null,
          paragraph6: project.paragraph6 ? createLexicalContent(project.paragraph6) : null,
        },
        images: detailImageIds,
        popupImages: popupImageIds,
        popupVideos: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })

      console.log(`✅ Migrated: ${project.title}`)
    } catch (error) {
      console.error(`❌ Failed: ${project.title}`, error.message)
    }
  }

  await client.close()
  console.log('🎉 Projects migration completed!')
}

migrateProjects().catch(console.error)
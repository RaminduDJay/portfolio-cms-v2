import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImageToCloudinary(imagePath: string, publicId?: string) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      folder: 'geenoth-blog',
      resource_type: 'auto',
    })
    return result
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

export async function uploadBlogImages(blogData: any[]) {
  const portfolioImagesPath = path.resolve(process.cwd(), '../geenoth-portfolio/public/assets/images')
  
  for (const blog of blogData) {
    try {
      // Upload main image
      if (blog.img) {
        const mainImagePath = path.join(portfolioImagesPath, blog.img)
        if (fs.existsSync(mainImagePath)) {
          const result = await uploadImageToCloudinary(mainImagePath, `blog-${blog.id}-main`)
          console.log(`✅ Uploaded main image for: ${blog.title}`)
        }
      }

      // Upload detail images
      const detailImages = [blog.imgdt1, blog.imgdt2, blog.imgdt3].filter(Boolean)
      for (let i = 0; i < detailImages.length; i++) {
        const imagePath = path.join(portfolioImagesPath, detailImages[i])
        if (fs.existsSync(imagePath)) {
          await uploadImageToCloudinary(imagePath, `blog-${blog.id}-detail-${i + 1}`)
          console.log(`✅ Uploaded detail image ${i + 1} for: ${blog.title}`)
        }
      }
    } catch (error) {
      console.error(`❌ Failed to upload images for: ${blog.title}`, error)
    }
  }
}
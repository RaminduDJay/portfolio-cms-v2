import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

async function clearProjects() {
  const client = new MongoClient(process.env.DATABASE_URL)
  await client.connect()
  const db = client.db()
  
  // Clear only project-related media
  await db.collection('media').deleteMany({ filename: /^[0-9]+-/ })
  await db.collection('projects').deleteMany({})
  
  console.log('✅ Projects data cleared')
  await client.close()
}

clearProjects().catch(console.error)
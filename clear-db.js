import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

async function clearDatabase() {
  const client = new MongoClient(process.env.DATABASE_URL)
  await client.connect()
  const db = client.db()
  
  await db.collection('blog-posts').deleteMany({})
  await db.collection('media').deleteMany({})
  
  console.log('✅ Database cleared')
  await client.close()
}

clearDatabase().catch(console.error)
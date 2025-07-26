/**
 * Configuración de conexión a MongoDB
 *  Base de datos: EcoCycleXR
 */

import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En producción, es mejor no usar una variable global
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

/**
 * Obtiene la instancia de la base de datos EcoCycleXR
 */
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("EcoCycleXR")
}

/**
 * Verifica la conexión a MongoDB
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = await clientPromise
    await client.db("admin").command({ ping: 1 })
    console.log("✅ Conexión a MongoDB EcoCycleXR exitosa")
    return true
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error)
    return false
  }
}

export default clientPromise

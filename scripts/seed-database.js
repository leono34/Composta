/**
 * Script para poblar la base de datos con datos de ejemplo
 * Ejecutar con: node scripts/seed-database.js
 */

const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/EcoCycleXR"
const DB_NAME = "EcoCycleXR"

const sampleUsers = [
  {
    name: "Juan Pérez",
    email: "juan@email.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O", // password123
    userType: "persona",
    phone: "555-0123",
    address: "Calle Principal 123, Ciudad",
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    name: "María González",
    email: "admin@ecotech.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O", // password123
    userType: "empresa",
    companyName: "EcoTech Solutions",
    sector: "manufactura",
    rfc: "ETS123456789",
    contactPerson: "María González",
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
]

const sampleProducts = [
  {
    qrCode: "ECO-2024-001234",
    name: "Botella PET Reciclable",
    category: "Envases",
    manufacturer: {
      name: "EcoPlastics SA",
      id: "EP001",
      contact: "contacto@ecoplastics.com",
    },
    materials: [
      { type: "PET", percentage: 95, recyclable: true },
      { type: "Etiqueta papel", percentage: 5, recyclable: true },
    ],
    carbonFootprint: 45,
    recycledContent: 30,
    estimatedLifespan: 12,
    currentStage: "uso",
    stages: [
      {
        stage: "fabricacion",
        date: new Date("2024-01-15"),
        location: "Planta Industrial, México",
        description: "Producto fabricado con 30% material reciclado",
        responsible: "EcoPlastics SA",
      },
      {
        stage: "distribucion",
        date: new Date("2024-01-20"),
        location: "Centro de Distribución Norte",
        description: "Distribuido a puntos de venta",
        responsible: "LogiVerde",
      },
      {
        stage: "uso",
        date: new Date("2024-02-01"),
        location: "Usuario Final",
        description: "Producto en uso por el consumidor",
        responsible: "Consumidor",
      },
    ],
    valorizationPoints: [
      {
        id: "vp001",
        name: "EcoRecicla Centro",
        type: "Centro de Reciclaje",
        coordinates: { lat: 19.4326, lng: -99.1332 },
        distance: 2.5,
        services: ["Reciclaje PET", "Separación", "Limpieza"],
      },
      {
        id: "vp002",
        name: "Planta de Valorización Norte",
        type: "Planta Industrial",
        coordinates: { lat: 19.4978, lng: -99.1269 },
        distance: 8.2,
        services: ["Reciclaje químico", "Recuperación energética"],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Conectado a MongoDB")

    const db = client.db(DB_NAME)

    // Limpiar colecciones existentes
    await db.collection("users").deleteMany({})
    await db.collection("products").deleteMany({})

    // Insertar usuarios de ejemplo
    await db.collection("users").insertMany(sampleUsers)
    console.log(`✅ Insertados ${sampleUsers.length} usuarios de ejemplo`)

    // Insertar productos de ejemplo
    await db.collection("products").insertMany(sampleProducts)
    console.log(`✅ Insertados ${sampleProducts.length} productos de ejemplo`)

    // Crear índices
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("products").createIndex({ qrCode: 1 }, { unique: true })
    await db.collection("wastes").createIndex({ userId: 1 })

    console.log("✅ Índices creados correctamente")
    console.log("🎉 Base de datos poblada exitosamente")
  } catch (error) {
    console.error("❌ Error poblando la base de datos:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()

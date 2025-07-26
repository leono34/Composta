/**
 * Script para crear la colección de trazabilidad en MongoDB
 * Ejecutar con: node scripts/create-traceability-collection.js
 */

const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "EcoCycleXR"

async function createTraceabilityCollection() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Conectado a MongoDB")

    const db = client.db(DB_NAME)

    // Crear colección de trazabilidad
    const traceabilityCollection = db.collection("traceability")

    // Crear índices para optimizar consultas
    await traceabilityCollection.createIndex({ wasteId: 1 }, { unique: true })
    await traceabilityCollection.createIndex({ qrCode: 1 }, { unique: true })
    await traceabilityCollection.createIndex({ userId: 1 })
    await traceabilityCollection.createIndex({ currentStep: 1 })
    await traceabilityCollection.createIndex({ createdAt: -1 })

    console.log("✅ Colección 'traceability' creada con índices")

    // Insertar datos de ejemplo
    const sampleTraceability = [
      {
        wasteId: "sample_waste_id_1",
        userId: "sample_user_id_1",
        qrCode: "ECO-2024-SAMPLE1",
        currentStep: 2,
        steps: [
          {
            id: "step_1",
            title: "Registro",
            description: "Residuo registrado en el sistema",
            date: new Date(),
            status: "completed",
            location: "Sistema EcoCycle XR",
            responsible: "Sistema Automatizado",
          },
          {
            id: "step_2",
            title: "Análisis IA",
            description: "Análisis completado y rutas generadas",
            date: new Date(),
            status: "completed",
            location: "Servidor de IA",
            responsible: "Stability AI + Algoritmo",
          },
          {
            id: "step_3",
            title: "Recolección",
            description: "Programación de recolección",
            date: new Date(Date.now() + 24 * 60 * 60 * 1000),
            status: "pending",
            location: "Centro de Recolección",
            responsible: "Equipo de Logística",
          },
        ],
        productInfo: {
          name: "Botellas de Plástico PET",
          category: "Plásticos",
          materials: [
            { type: "PET", percentage: 95, recyclable: true },
            { type: "Etiqueta", percentage: 5, recyclable: false },
          ],
          carbonFootprint: 25,
          recycledContent: 0,
          estimatedLifespan: 6,
        },
        valorizationPoints: [
          {
            id: "vp001",
            name: "EcoRecicla Centro",
            type: "Centro de Reciclaje",
            coordinates: { lat: 19.4326, lng: -99.1332 },
            distance: 2.5,
            services: ["Reciclaje mecánico", "Separación"],
            contact: "contacto@ecorecicla.com",
          },
        ],
        impact: {
          co2Avoided: 15,
          energySaved: 45,
          waterSaved: 120,
          wasteReduced: 3,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Insertar solo si la colección está vacía
    const count = await traceabilityCollection.countDocuments()
    if (count === 0) {
      await traceabilityCollection.insertMany(sampleTraceability)
      console.log(`✅ Insertados ${sampleTraceability.length} registros de ejemplo`)
    } else {
      console.log("ℹ️ La colección ya contiene datos, omitiendo inserción de ejemplos")
    }

    console.log("🎉 Colección de trazabilidad configurada exitosamente")

    // Mostrar estructura de la colección
    console.log("\n📋 Estructura de la colección 'traceability':")
    console.log("- _id: ObjectId (automático)")
    console.log("- wasteId: ObjectId (referencia a waste)")
    console.log("- userId: ObjectId (referencia a user)")
    console.log("- qrCode: String (único)")
    console.log("- currentStep: Number")
    console.log("- steps: Array de objetos con información de cada paso")
    console.log("- productInfo: Objeto con información del producto")
    console.log("- valorizationPoints: Array de puntos de valorización")
    console.log("- impact: Objeto con métricas de impacto ambiental")
    console.log("- createdAt: Date")
    console.log("- updatedAt: Date")
    console.log("- completedAt: Date (opcional)")
  } catch (error) {
    console.error("❌ Error creando colección de trazabilidad:", error)
  } finally {
    await client.close()
  }
}

createTraceabilityCollection()

/**
 * Simulación de base de datos para trazabilidad de productos
 * En producción, esto se conectaría a una base de datos real
 */

interface ProductData {
  id: string
  name: string
  qrCode: string
  manufacturer: string
  createdAt: string
  currentStage: string
}

// Base de datos simulada de productos
const PRODUCTS_DB: Record<string, ProductData> = {
  "ECO-2024-001234": {
    id: "prod_001",
    name: "Botella PET Reciclable",
    qrCode: "ECO-2024-001234",
    manufacturer: "EcoPlastics SA",
    createdAt: "2024-01-15",
    currentStage: "uso",
  },
  "ECO-2024-005678": {
    id: "prod_002",
    name: "Envase Biodegradable",
    qrCode: "ECO-2024-005678",
    manufacturer: "GreenPack Ltd",
    createdAt: "2024-02-10",
    currentStage: "distribucion",
  },
  "ECO-2024-009876": {
    id: "prod_003",
    name: "Papel Reciclado",
    qrCode: "ECO-2024-009876",
    manufacturer: "RecyclePaper Co",
    createdAt: "2024-01-28",
    currentStage: "reciclaje",
  },
}

/**
 * Obtiene los datos de trazabilidad de un producto por su código QR
 */
export function getProductTraceability(qrCode: string): ProductData | null {
  const product = PRODUCTS_DB[qrCode]

  if (!product) {
    return null
  }

  return {
    ...product,
    // Agregar datos adicionales simulados
    carbonFootprint: Math.round(Math.random() * 50 + 10), // kg CO2
    recycledContent: Math.round(Math.random() * 80 + 20), // porcentaje
    estimatedLifespan: Math.round(Math.random() * 24 + 6), // meses
  }
}

/**
 * Simula la creación de un nuevo producto en el sistema
 */
export function createProductRecord(productData: Omit<ProductData, "id">): ProductData {
  const newProduct: ProductData = {
    id: `prod_${Date.now()}`,
    ...productData,
  }

  // En producción, esto se guardaría en la base de datos
  PRODUCTS_DB[productData.qrCode] = newProduct

  return newProduct
}

/**
 * Obtiene estadísticas de trazabilidad
 */
export function getTraceabilityStats() {
  const products = Object.values(PRODUCTS_DB)

  return {
    totalProducts: products.length,
    activeTracking: products.filter((p) => p.currentStage !== "reciclaje").length,
    completedCycles: products.filter((p) => p.currentStage === "reciclaje").length,
    avgLifespan: 18, // meses (simulado)
  }
}

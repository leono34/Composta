import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Waste } from "@/lib/models/Waste"
import type { User } from "@/lib/models/User"

interface TraceabilityStep {
  id: string
  title: string
  description: string
  date: Date | null
  status: "completed" | "current" | "pending"
  location: string
  responsible: string
  estimatedDuration?: string
  requirements?: string[]
  environmentalImpact?: {
    co2Reduction: number
    energySaved: number
    waterSaved: number
  }
}

interface AITraceabilityData {
  qrCode: string
  steps: TraceabilityStep[]
  productInfo: {
    name: string
    category: string
    materials: Array<{
      type: string
      percentage: number
      recyclable: boolean
    }>
    carbonFootprint: number
    recycledContent: number
    estimatedLifespan: number
  }
  valorizationPoints: Array<{
    name: string
    location: string
    capacity: string
    specialization: string[]
    distance: number
  }>
  impact: {
    co2Avoided: number
    energySaved: number
    waterSaved: number
    wasteReduced: number
  }
  recommendations: string[]
}

export async function generateAITraceability(waste: Waste, user: User): Promise<AITraceabilityData> {
  try {
    const prompt = `
    Genera una trazabilidad completa e inteligente para el siguiente residuo:
    
    INFORMACIÓN DEL RESIDUO:
    - Nombre: ${waste.name}
    - Sector: ${waste.sector}
    - Composición: ${waste.composition}
    - Cantidad: ${waste.quantity} ${waste.unit}
    - Ubicación: ${waste.location.address}
    - Tipo de usuario: ${user.userType}
    - Usuario: ${user.name}
    ${user.userType === "empresa" ? `- Empresa: ${user.companyName}` : ""}
    
    GENERA UN JSON CON LA SIGUIENTE ESTRUCTURA:
    {
      "qrCode": "ECO-2024-[CÓDIGO_ÚNICO]",
      "steps": [
        {
          "id": "step_1",
          "title": "Registro",
          "description": "Descripción específica del paso",
          "date": "2024-01-15T10:00:00Z" o null,
          "status": "completed|current|pending",
          "location": "Ubicación específica",
          "responsible": "Responsable específico",
          "estimatedDuration": "2-3 días",
          "requirements": ["Requisito 1", "Requisito 2"],
          "environmentalImpact": {
            "co2Reduction": 5,
            "energySaved": 15,
            "waterSaved": 30
          }
        }
      ],
      "productInfo": {
        "name": "${waste.name}",
        "category": "Categoría específica",
        "materials": [
          {
            "type": "Material principal",
            "percentage": 85,
            "recyclable": true
          }
        ],
        "carbonFootprint": 25,
        "recycledContent": 30,
        "estimatedLifespan": 12
      },
      "valorizationPoints": [
        {
          "name": "Planta de Reciclaje XYZ",
          "location": "Dirección específica",
          "capacity": "500 ton/mes",
          "specialization": ["Plásticos", "Metales"],
          "distance": 15
        }
      ],
      "impact": {
        "co2Avoided": 15,
        "energySaved": 45,
        "waterSaved": 120,
        "wasteReduced": 3
      },
      "recommendations": [
        "Recomendación específica 1",
        "Recomendación específica 2"
      ]
    }
    
    INSTRUCCIONES ESPECÍFICAS:
    1. Crea 8 pasos realistas de trazabilidad desde registro hasta producto final
    2. Usa fechas reales para pasos completados y null para pendientes
    3. Calcula impactos ambientales realistas basados en el tipo de residuo
    4. Genera puntos de valorización cercanos a la ubicación
    5. Proporciona recomendaciones específicas para este tipo de residuo
    6. El código QR debe ser único y seguir el formato ECO-2024-[6 caracteres]
    7. Los materiales deben ser específicos al tipo de residuo
    8. Las duraciones deben ser realistas para cada proceso
    
    RESPONDE SOLO CON EL JSON, SIN TEXTO ADICIONAL.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
    })

    // Parsear la respuesta JSON
    const aiData = JSON.parse(text.trim())

    // Validar y completar datos faltantes
    return {
      qrCode: aiData.qrCode || `ECO-2024-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      steps: aiData.steps || generateDefaultSteps(),
      productInfo: aiData.productInfo || generateDefaultProductInfo(waste),
      valorizationPoints: aiData.valorizationPoints || [],
      impact: aiData.impact || {
        co2Avoided: Math.floor(Math.random() * 50) + 10,
        energySaved: Math.floor(Math.random() * 100) + 20,
        waterSaved: Math.floor(Math.random() * 200) + 50,
        wasteReduced: Math.floor(Math.random() * 10) + 1,
      },
      recommendations: aiData.recommendations || [
        "Separar correctamente los materiales",
        "Limpiar antes del procesamiento",
        "Contactar con centros de valorización certificados",
      ],
    }
  } catch (error) {
    console.error("Error generating AI traceability:", error)

    // Fallback: generar datos básicos si falla la IA
    return generateFallbackTraceability(waste, user)
  }
}

function generateDefaultSteps(): TraceabilityStep[] {
  const now = new Date()

  return [
    {
      id: "step_1",
      title: "Registro",
      description: "Residuo registrado en el sistema EcoCycle XR",
      date: now,
      status: "completed",
      location: "Sistema EcoCycle XR",
      responsible: "Sistema Automatizado",
      estimatedDuration: "Inmediato",
      environmentalImpact: { co2Reduction: 0, energySaved: 0, waterSaved: 0 },
    },
    {
      id: "step_2",
      title: "Análisis IA",
      description: "Análisis completado y rutas de valorización generadas",
      date: now,
      status: "completed",
      location: "Centro de Procesamiento IA",
      responsible: "Sistema de IA",
      estimatedDuration: "1-2 minutos",
      environmentalImpact: { co2Reduction: 2, energySaved: 5, waterSaved: 0 },
    },
    {
      id: "step_3",
      title: "Programación de Recolección",
      description: "Coordinación con servicios de recolección especializada",
      date: null,
      status: "current",
      location: "Centro de Coordinación",
      responsible: "Equipo de Logística",
      estimatedDuration: "2-5 días",
      requirements: ["Contenedores apropiados", "Transporte especializado"],
    },
    {
      id: "step_4",
      title: "Recolección",
      description: "Recolección física del residuo",
      date: null,
      status: "pending",
      location: "Ubicación del usuario",
      responsible: "Equipo de Recolección",
      estimatedDuration: "1 día",
      environmentalImpact: { co2Reduction: 5, energySaved: 10, waterSaved: 15 },
    },
    {
      id: "step_5",
      title: "Transporte",
      description: "Transporte a planta de valorización",
      date: null,
      status: "pending",
      location: "En tránsito",
      responsible: "Transportista Certificado",
      estimatedDuration: "1-2 días",
    },
    {
      id: "step_6",
      title: "Clasificación",
      description: "Clasificación y separación de materiales",
      date: null,
      status: "pending",
      location: "Planta de Valorización",
      responsible: "Técnicos Especializados",
      estimatedDuration: "1-3 días",
      environmentalImpact: { co2Reduction: 8, energySaved: 20, waterSaved: 25 },
    },
    {
      id: "step_7",
      title: "Procesamiento",
      description: "Procesamiento y transformación del material",
      date: null,
      status: "pending",
      location: "Planta de Procesamiento",
      responsible: "Operadores de Planta",
      estimatedDuration: "3-7 días",
      environmentalImpact: { co2Reduction: 15, energySaved: 35, waterSaved: 50 },
    },
    {
      id: "step_8",
      title: "Producto Final",
      description: "Conversión en nuevo producto o materia prima",
      date: null,
      status: "pending",
      location: "Centro de Distribución",
      responsible: "Equipo de Calidad",
      estimatedDuration: "1-2 días",
      environmentalImpact: { co2Reduction: 20, energySaved: 40, waterSaved: 80 },
    },
  ]
}

function generateDefaultProductInfo(waste: Waste) {
  return {
    name: waste.name,
    category: waste.sector,
    materials: [
      {
        type: "Material principal",
        percentage: 85,
        recyclable: true,
      },
      {
        type: "Material secundario",
        percentage: 15,
        recyclable: false,
      },
    ],
    carbonFootprint: Math.floor(Math.random() * 50) + 10,
    recycledContent: Math.floor(Math.random() * 60) + 20,
    estimatedLifespan: Math.floor(Math.random() * 24) + 6,
  }
}

function generateFallbackTraceability(waste: Waste, user: User): AITraceabilityData {
  return {
    qrCode: `ECO-2024-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    steps: generateDefaultSteps(),
    productInfo: generateDefaultProductInfo(waste),
    valorizationPoints: [
      {
        name: "Centro de Valorización Local",
        location: "Zona Industrial",
        capacity: "200 ton/mes",
        specialization: [waste.sector],
        distance: 10,
      },
    ],
    impact: {
      co2Avoided: Math.floor(Math.random() * 50) + 10,
      energySaved: Math.floor(Math.random() * 100) + 20,
      waterSaved: Math.floor(Math.random() * 200) + 50,
      wasteReduced: Math.floor(Math.random() * 10) + 1,
    },
    recommendations: [
      "Separar correctamente los materiales",
      "Limpiar antes del procesamiento",
      "Contactar con centros de valorización certificados",
    ],
  }
}

export async function updateTraceabilityStep(
  traceabilityId: string,
  stepId: string,
  newStatus: "completed" | "current" | "pending",
): Promise<boolean> {
  try {
    const response = await fetch(`/api/traceability/update-step`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        traceabilityId,
        stepId,
        status: newStatus,
        date: newStatus === "completed" ? new Date() : null,
      }),
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error updating traceability step:", error)
    return false
  }
}

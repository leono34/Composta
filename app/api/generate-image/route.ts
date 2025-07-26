import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()

    if (!requestBody.text_prompts || requestBody.text_prompts.length === 0) {
      return NextResponse.json({ error: "Text prompts are required" }, { status: 400 })
    }

    // Usar Stability AI - Stable Diffusion
    const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: requestBody.text_prompts,
        cfg_scale: requestBody.cfg_scale || 7,
        height: requestBody.height || 1024,
        width: requestBody.width || 1024,
        samples: requestBody.samples || 1,
        steps: requestBody.steps || 30,
        style_preset: requestBody.style_preset || "photographic",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Stability AI API error:", response.status, errorText)
      return NextResponse.json(
        {
          error: "Failed to generate image",
          details: errorText,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

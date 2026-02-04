import { NextResponse } from 'next/server'
import { getAllPredictions } from '@/lib/db'
import { getSignedImageUrl } from '@/lib/r2'

export async function GET() {
  try {
    const predictions = await getAllPredictions()

    // Generate signed URLs for scan images
    const predictionsWithUrls = await Promise.all(
      predictions.map(async (prediction) => {
        if (prediction.scan_image_url && !prediction.scan_image_url.startsWith('http')) {
          const signedUrl = await getSignedImageUrl(prediction.scan_image_url)
          return { ...prediction, scan_image_url: signedUrl }
        }
        return prediction
      })
    )

    return NextResponse.json({ predictions: predictionsWithUrls })
  } catch (error) {
    console.error('Error fetching predictions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

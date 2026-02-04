import { NextResponse } from 'next/server'
import { getLeadStats } from '@/lib/db'

export async function GET() {
  try {
    const stats = await getLeadStats()

    return NextResponse.json({
      total: stats.total,
      converted: stats.converted,
      recent: stats.recent,
      conversionRate: stats.total ? Math.round(stats.converted / stats.total * 100) : 0,
    })
  } catch (error) {
    console.error('Lead stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

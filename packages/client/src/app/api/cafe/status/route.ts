import { NextResponse } from 'next/server';

export async function GET() {
  // Return mock cafe status
  return NextResponse.json({
    success: true,
    data: {
      isOpen: true,
      currentOccupancy: 15,
      totalStations: 28,
      openingTime: '10:00',
      closingTime: '23:00',
      lastUpdated: new Date().toISOString(),
    },
  });
}

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET() {
  // Return mock devices
  const devices = [
    { id: 'pc-01', name: 'PC Station 1', type: 'pc', stationNumber: 1, status: 'available', specs: { cpu: 'i7-13700K', gpu: 'RTX 4070', ram: '32GB DDR5', monitor: '27" 240Hz', peripherals: ['Keyboard', 'Mouse', 'Headset'] }, hourlyRate: 8 },
    { id: 'pc-02', name: 'PC Station 2', type: 'pc', stationNumber: 2, status: 'occupied', specs: { cpu: 'i7-13700K', gpu: 'RTX 4070', ram: '32GB DDR5', monitor: '27" 240Hz', peripherals: ['Keyboard', 'Mouse', 'Headset'] }, hourlyRate: 8 },
    { id: 'ps5-01', name: 'PS5 Station 1', type: 'ps5', stationNumber: 6, status: 'available', specs: { controllers: 2, tvSize: '55" 4K', games: ['FIFA 24', 'Spider-Man 2', 'God of War'] }, hourlyRate: 10 },
    { id: 'ps5-02', name: 'PS5 Station 2', type: 'ps5', stationNumber: 7, status: 'available', specs: { controllers: 2, tvSize: '55" 4K', games: ['FIFA 24', 'Spider-Man 2', 'God of War'] }, hourlyRate: 10 },
    { id: 'pool-01', name: 'Pool Table 1', type: 'pool_table', stationNumber: 9, status: 'available', hourlyRate: 12 },
  ];

  return NextResponse.json({ success: true, data: devices });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  if (!body.type) {
    return NextResponse.json({ success: false, message: 'Device type required' }, { status: 400 });
  }

  const devices = [
    { id: 'pc-01', name: 'PC Station 1', type: 'pc', stationNumber: 1, status: 'available', hourlyRate: 8 },
    { id: 'pc-02', name: 'PC Station 2', type: 'pc', stationNumber: 2, status: 'occupied', hourlyRate: 8 },
  ].filter(d => d.type === body.type);

  return NextResponse.json({ success: true, data: devices });
}

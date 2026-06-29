import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Simulate login
  const body = await request.json().catch(() => ({}));

  if (!body.email || !body.password) {
    return NextResponse.json(
      { success: false, message: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Demo response
  return NextResponse.json({
    success: true,
    data: {
      token: 'demo.' + Buffer.from(JSON.stringify({ userId: 'demo-user', email: body.email, exp: Date.now() / 1000 + 86400 })).toString('base64') + '.signature',
      user: {
        id: 'demo-user',
        name: body.email.split('@')[0],
        email: body.email,
        createdAt: new Date().toISOString(),
      },
    },
  });
}

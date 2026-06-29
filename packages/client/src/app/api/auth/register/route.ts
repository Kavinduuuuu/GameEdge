import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  if (!body.email || !body.password || !body.name) {
    return NextResponse.json(
      { success: false, message: 'Name, email, and password are required' },
      { status: 400 }
    );
  }

  if (body.password.length < 8) {
    return NextResponse.json(
      { success: false, message: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  // Demo response
  return NextResponse.json({
    success: true,
    data: {
      token: 'demo.' + Buffer.from(JSON.stringify({ userId: 'demo-user-' + Date.now(), email: body.email, exp: Date.now() / 1000 + 86400 })).toString('base64') + '.signature',
      user: {
        id: 'demo-user-' + Date.now(),
        name: body.name,
        email: body.email,
        phone: body.phone,
        createdAt: new Date().toISOString(),
      },
    },
  });
}

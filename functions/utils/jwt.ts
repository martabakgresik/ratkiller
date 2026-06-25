import { SignJWT, jwtVerify } from 'jose';

export async function signToken(payload: any, secret: string): Promise<string> {
  const encodedSecret = new TextEncoder().encode(secret);
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(encodedSecret);
  return jwt;
}

export async function verifyToken(token: string, secret: string): Promise<any> {
  const encodedSecret = new TextEncoder().encode(secret);
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch (error) {
    return null;
  }
}

export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set.');
}

interface TokenPayload extends JwtPayload {
  userId: number;
  email: string;
}

export function verifyToken(token: string): TokenPayload {
  try {
    // Verifikasi token, lalu casting ke TokenPayload
    const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as TokenPayload;

    if (!decoded.userId || !decoded.email) {
      throw new Error('Token payload is missing required fields');
    }

    return decoded;
  } catch (err) {
    // Pastikan variabel error dipakai untuk menghindari warning
    console.error('Token verification failed:', err);
    throw new Error('Invalid or expired token');
  }
}

import { getDb } from '@/lib/db';
import { Stock } from '@/types';

export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM stocks ORDER BY ticker ASC').all() as Stock[];
  return Response.json(rows);
}

export async function POST(request: Request) {
  const db = getDb();
  const s: Stock = await request.json();
  db.prepare(`
    INSERT INTO stocks (id, ticker, shares, avgPrice, currentPrice, updatedAt)
    VALUES (@id, @ticker, @shares, @avgPrice, @currentPrice, @updatedAt)
  `).run(s);
  return Response.json(s, { status: 201 });
}

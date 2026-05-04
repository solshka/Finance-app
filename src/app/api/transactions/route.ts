import { getDb } from '@/lib/db';
import { Transaction } from '@/types';

export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM transactions ORDER BY date DESC, createdAt DESC').all() as Transaction[];
  const transactions = rows.map((r) => ({ ...r, isSubscription: Boolean(r.isSubscription) }));
  return Response.json(transactions);
}

export async function POST(request: Request) {
  const db = getDb();
  const t: Transaction = await request.json();
  db.prepare(`
    INSERT INTO transactions (id, date, amount, type, expenseType, category, note, isSubscription, createdAt)
    VALUES (@id, @date, @amount, @type, @expenseType, @category, @note, @isSubscription, @createdAt)
  `).run({ ...t, isSubscription: t.isSubscription ? 1 : 0 });
  return Response.json(t, { status: 201 });
}

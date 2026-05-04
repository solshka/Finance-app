import { getDb } from '@/lib/db';
import type { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/transactions/[id]'>) {
  const db = getDb();
  const { id } = await ctx.params;
  const body = await request.json();

  const fields = Object.keys(body)
    .map((k) => `${k} = @${k}`)
    .join(', ');

  const values = { ...body, id, isSubscription: body.isSubscription != null ? (body.isSubscription ? 1 : 0) : undefined };
  db.prepare(`UPDATE transactions SET ${fields} WHERE id = @id`).run(values);
  return Response.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/transactions/[id]'>) {
  const db = getDb();
  const { id } = await ctx.params;
  db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
  return Response.json({ ok: true });
}

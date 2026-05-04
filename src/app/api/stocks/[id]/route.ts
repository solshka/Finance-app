import { getDb } from '@/lib/db';
import type { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/stocks/[id]'>) {
  const db = getDb();
  const { id } = await ctx.params;
  const body = await request.json();

  const fields = Object.keys(body)
    .map((k) => `${k} = @${k}`)
    .join(', ');

  db.prepare(`UPDATE stocks SET ${fields} WHERE id = @id`).run({ ...body, id });
  return Response.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/stocks/[id]'>) {
  const db = getDb();
  const { id } = await ctx.params;
  db.prepare('DELETE FROM stocks WHERE id = ?').run(id);
  return Response.json({ ok: true });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers')?.split(',').filter(Boolean) ?? [];

  const results: Record<string, number | null> = {};

  await Promise.all(
    tickers.map(async (ticker) => {
      // 数字のみなら日本株として .T を付与
      const yticker = /^\d+$/.test(ticker) ? `${ticker}.T` : ticker;
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${yticker}?interval=1d&range=1d`,
          { headers: { 'User-Agent': 'Mozilla/5.0' } }
        );
        const data = await res.json();
        results[ticker] = data.chart?.result?.[0]?.meta?.regularMarketPrice ?? null;
      } catch {
        results[ticker] = null;
      }
    })
  );

  return Response.json(results);
}

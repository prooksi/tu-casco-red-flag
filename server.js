import express from 'express';
import * as cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 3000;
const SOURCE = 'https://www.conaset.cl/cascos-acreditados/';
const TTL = 1000 * 60 * 60 * 6;
let cache = { data: [], updated: null, fetchedAt: 0 };

const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const key = value => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');

async function fetchHelmets() {
  if (cache.data.length && Date.now() - cache.fetchedAt < TTL) return cache;
  const response = await fetch(SOURCE, { headers: { 'User-Agent': 'TuCascoRedFlag/3.0' } });
  if (!response.ok) throw new Error(`CONASET respondió ${response.status}`);
  const html = await response.text();
  const $ = cheerio.load(html);
  const data = [];
  $('table tr').each((_, tr) => {
    const cells = $(tr).find('td').map((_, td) => clean($(td).text())).get();
    if (cells.length >= 3 && cells[1] && cells[2] && !/^marca$/i.test(cells[1])) {
      data.push({ company: cells[0], brand: cells[1], model: cells[2] });
    }
  });
  if (!data.length) throw new Error('No fue posible leer el listado de CONASET.');
  cache = { data, updated: new Date().toISOString(), fetchedAt: Date.now() };
  return cache;
}

app.use(express.static('public'));
app.get('/api/cascos', async (_, res) => {
  try {
    const result = await fetchHelmets();
    res.json({ source: SOURCE, updated: result.updated, count: result.data.length, data: result.data });
  } catch (error) {
    if (cache.data.length) return res.json({ source: SOURCE, updated: cache.updated, count: cache.data.length, data: cache.data, cached: true });
    res.status(502).json({ error: error.message, source: SOURCE });
  }
});

app.listen(PORT, () => console.log(`Tu Casco es Red Flag V3: http://localhost:${PORT}`));

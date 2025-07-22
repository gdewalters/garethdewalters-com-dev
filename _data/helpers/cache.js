import fs from 'fs';
import path from 'path';

export default async function cachedFetch(key, fetcher, ttlSeconds = 3600) {
  const cacheDir = path.resolve('.cache');
  const cacheFile = path.join(cacheDir, `${key}.json`);
  const now = Date.now();

  if (fs.existsSync(cacheFile)) {
    try {
      const { timestamp, payload } = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      if (now - timestamp < ttlSeconds * 1000) {
        return payload;
      }
    } catch {
      // ignore corrupted cache
    }
  }

  const payload = await fetcher();
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  fs.writeFileSync(cacheFile, JSON.stringify({ timestamp: now, payload }), 'utf8');
  return payload;
}

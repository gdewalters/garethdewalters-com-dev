import client from '../_helpers/contentfulClient.js';
import cachedFetch from '../_helpers/cache.js';

export default async function siteHomePage() {
  const entryId = process.env.SITE_HOME_ENTRY_ID;

  if (!entryId) {
    throw new Error('SITE_HOME_ENTRY_ID environment variable is required.');
  }

  const fetcher = async () => {
    const entry = await client.getEntry(entryId, { include: 6 });
    return {
      ...entry.fields,
      sys: entry.sys
    };
  };

  try {
    return await cachedFetch(`siteHomePage_${entryId}`, fetcher);
  } catch (error) {
    console.error('Error fetching site home page entry:', error);
    return null;
  }
}

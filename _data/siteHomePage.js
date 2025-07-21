import client from './helpers/contentfulClient.js';

export default async function siteHomePage() {
  try {
    const entryId = process.env.SITE_HOME_ENTRY_ID;
    if (!entryId) {
      throw new Error('SITE_HOME_ENTRY_ID env variable is missing');
    }

    const entry = await client.getEntry(entryId, { include: 3 });

    return {
      ...entry.fields,
      sys: entry.sys
    };
  } catch (error) {
    console.error('Error fetching site home page entry:', error);
    return null;
  }
}


import client from './helpers/contentfulClient.js';

export default async function getContentfulSiteHomePage() {
  const entryId = process.env.SITE_HOME_ENTRY_ID;

  if (!entryId) {
    throw new Error('SITE_HOME_ENTRY_ID environment variable is required.');
  }

  try {
    const entry = await client.getEntry(entryId, { include: 6 });

    return {
      ...entry.fields,
      sys: entry.sys,
    };
  } catch (error) {
    console.error('Error fetching composeSiteHomePage entry:', error);
    return null;
  }
}

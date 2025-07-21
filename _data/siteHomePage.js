import client from './helpers/contentfulClient.js';

export default async function siteHomePage() {
  try {
    const entryId = '4aiHsUsWbbsmUn9Egjcsk0';
    const entry = await client.getEntry(entryId, { include: 6 });

    return {
      ...entry.fields,
      sys: entry.sys
    };
  } catch (error) {
    console.error('Error fetching site home page entry:', error);
    return null;
  }
}
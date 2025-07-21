import client from './helpers/contentfulClient.js';

export default async function getContentfulSiteHomePage(id) {
  try {
    const entry = await client.getEntry(id, { include: 3 });

    return {
      ...entry.fields,
      sys: entry.sys,
    };
  } catch (error) {
    console.error('Error fetching composeSiteHomePage entry:', error);
    return null;
  }
}

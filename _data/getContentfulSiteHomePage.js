import client from './helpers/contentfulClient.js';

export default async function getContentfulSiteHomePage() {
  try {
    const entries = await client.getEntries({
      content_type: 'composeSiteHomePage',
      limit: 1,
      include: 3
    });

    return entries.items.map(item => ({
      ...item.fields,
      sys: item.sys
    }));
  } catch (error) {
    console.error('Error fetching composeSiteHomePage entries:', error);
    return [];
  }
}

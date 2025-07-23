import client from '../_helpers/contentfulClient.js';
import parseImageWrapper from '../_helpers/parseImageWrapper.js';
import cachedFetch from '../_helpers/cache.js';

export default async function getContentfulPages() {
  const fetcher = async () => {
    const entries = await client.getEntries({
      content_type: 'composePage',
      order: 'fields.pageTitle',
      include: 3
    });

    return entries.items.map(item => {
      const fields = { ...item.fields };
      fields.mainImage = parseImageWrapper(fields.mainImage);
      return {
        ...fields,
        sys: item.sys,
      };
    });
  };

  try {
    return await cachedFetch('pages', fetcher);
  } catch (error) {
    console.error('Error fetching composePage entries:', error);
    return [];
  }
}

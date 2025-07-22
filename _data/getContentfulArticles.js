import client from './helpers/contentfulClient.js';
import parseImageWrapper from './helpers/parseImageWrapper.js';
import cachedFetch from './helpers/cache.js';

export default async function getContentfulArticles() {
  const fetcher = async () => {
    const entries = await client.getEntries({
      content_type: 'composeArticle',
      order: '-fields.datePublished',
      include: 3
    });

    return entries.items.map(item => {
      const fields = { ...item.fields };
      fields.mainImage = parseImageWrapper(fields.mainImage);
      return {
        ...fields,
        sys: item.sys
      };
    });
  };

  try {
    return await cachedFetch('articles', fetcher);
  } catch (error) {
    console.error('Error fetching composeArticle entries:', error);
    return [];
  }
}

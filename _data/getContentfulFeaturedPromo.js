import client from '../_helpers/contentfulClient.js';
import parseImageWrapper from '../_helpers/parseImageWrapper.js';
import cachedFetch from '../_helpers/cache.js';

export default async function getContentfulFeaturedPromo() {
  // const entryId = process.env.FEATURED_PROMO_ENTRY_ID;
  const entryId = '5Xdx6Pcqw8f75JSERlMMJh'; // For testing purposes, replace with actual environment variable in production

  if (!entryId) {
    console.warn('FEATURED_PROMO_ENTRY_ID environment variable is not set.');
    return null;
  }

  const fetcher = async () => {
    const entry = await client.getEntry(entryId, { include: 3 });
    const fields = { ...entry.fields };
    const deck = (fields.deckContent || []).map(item => {
      const typeId = item.sys?.contentType?.sys?.id;
      if (typeId === 'composeArticle') {
        const articleFields = { ...item.fields };
        articleFields.mainImage = parseImageWrapper(articleFields.mainImage);
        return { ...articleFields, sys: item.sys };
      }
      if (typeId === 'componentCard') {
        return { ...item.fields, sys: item.sys };
      }
      return null;
    }).filter(Boolean);
    return { ...fields, deckContent: deck, sys: entry.sys };
  };

  try {
    return await cachedFetch(`cardDeck_${entryId}`, fetcher);
  } catch (error) {
    console.error('Error fetching card deck entry:', error);
    return null;
  }
}

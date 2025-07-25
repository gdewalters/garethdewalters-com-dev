import client from '../_helpers/contentfulClient.js';
import parseImageWrapper from '../_helpers/parseImageWrapper.js';
import cachedFetch from '../_helpers/cache.js';

/** 
 * 
 * 
 * Fetches a single article entry from Contentful, specifically the one designated as the featured promo article.
 * This function retrieves the entry by its ID, processes the main image using `parseImageWrapper`.
 * 
 * It resues code from 'getContentfulFeaturedPromo.js' to ensure consistency in how images are handled, but may require
 * simplification because  deckContent is not needed for a single article.
 * 
 * To do: Fix the mainImage parsing to ensure it works correctly with the new image structure.
 * 
 **/ 

export default async function getContentfulArticleSingle() {
  // const entryId = process.env.PROMO_ARTICLE_ENTRY_ID;
  const entryId = '5Xdx6Pcqw8f75JSERlMMJh'; // For testing purposes, replace with actual environment variable in production

  if (!entryId) {
    console.warn('PROMO_ARTICLE_ENTRY_ID environment variable is not set.');
    return null;
  }

  const fetcher = async () => {
    const entry = await client.getEntry(entryId, { include: 3 });
    const fields = { ...entry.fields };

    // ✨ NEW LINE: Apply parseImageWrapper to the mainImage field of the top-level entry ✨
    if (fields.mainImage) { // Check if mainImage exists before parsing
      fields.mainImage = parseImageWrapper(fields.mainImage);
    }

    // This 'deck' processing might still be unnecessary if you only want a single article's fields.
    // However, for now, we're leaving it as is, focusing on the mainImage fix.
    const deck = (fields.deckContent || []).map(item => {
      const typeId = item.sys?.contentType?.sys?.id;
      if (typeId === 'composeArticle') {
        const articleFields = { ...item.fields };
        // This line is for images *within* the deckContent, if it were used.
        articleFields.mainImage = parseImageWrapper(articleFields.mainImage);
        return { ...articleFields, sys: item.sys };
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
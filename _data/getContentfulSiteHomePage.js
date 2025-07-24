import client from '../_helpers/contentfulClient.js';
import cachedFetch from '../_helpers/cache.js';
import parseImageWrapper from '../_helpers/parseImageWrapper.js';

export default async function siteHomePage() {
  const entryId = process.env.SITE_HOME_ENTRY_ID;

  if (!entryId) {
    throw new Error('SITE_HOME_ENTRY_ID environment variable is required.');
  }

  const fetcher = async () => {
    const entry = await client.getEntry(entryId, { include: 6 });
    // Log the full resolved entry structure for inspection
    console.log('Resolved Contentful Entry:', JSON.stringify(entry, null, 2));
    const fields = { ...entry.fields };
    if (Array.isArray(fields.contentSections)) {
      fields.contentSections = fields.contentSections.map(section => {
        const typeId = section.sys?.contentType?.sys?.id;
        if (typeId === 'patternFeaturePromoPrimary') {
          const image = parseImageWrapper(section.fields.image);
          return { ...section, fields: { ...section.fields, image } };
        }
        return section;
      });
    }
    return {
      ...fields,
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

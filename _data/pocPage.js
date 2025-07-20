import client from './helpers/contentfulClient.js';
import parseImageWrapper from './helpers/parseImageWrapper.js';

export default async function () {
  try {
    const entryId = process.env.PAGE_ENTRY_ID;
    if (!entryId) {
      throw new Error('PAGE_ENTRY_ID environment variable is required');
    }

    const entry = await client.getEntry(entryId, { include: 3 });
    const fields = { ...entry.fields };
    fields.mainImage = parseImageWrapper(fields.mainImage);

    return {
      ...fields,
      sys: entry.sys,
    };
  } catch (err) {
    console.error('Error fetching POC page:', err);
    return {};
  }
}

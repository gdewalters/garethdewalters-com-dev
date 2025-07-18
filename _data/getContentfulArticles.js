import client from './helpers/contentfulClient.js';

export default async function getContentfulArticles() {
  try {
    const entries = await client.getEntries({
      content_type: 'composeArticle',
      order: '-fields.datePublished',
      include: 3
    });

    const parseImageWrapper = (wrapper) => {
      if (!wrapper || !wrapper.fields) {
        return null;
      }

      const { imageFile, imageAlternativeText, imageCaption, creatorPhotographer, licenceInformation } = wrapper.fields;

      if (!imageFile?.fields?.file?.url) {
        return null;
      }

      const asset = imageFile.fields;

      return {
        url: `https:${asset.file.url}`,
        alt: imageAlternativeText || asset.title || '',
        caption: imageCaption || null,
        photographer: creatorPhotographer || null,
        licence: licenceInformation || null,
        details: asset.file.details,
      };
    };

    return entries.items.map(item => {
      const fields = { ...item.fields };

      fields.mainImage = parseImageWrapper(fields.mainImage);

      return {
        ...fields,
        sys: item.sys
      };
    });
  } catch (error) {
    console.error('Error fetching composeArticle entries:', error);
    return [];
  }
}

// _data/composeArticle.js (11ty project path)
import * as contentful from "contentful"; // ESM import for the Contentful SDK

export default async function() { // ESM export default
  // Initialize Contentful client with your credentials
  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN
  });

  try {
    // Fetch all entries of your 'composeArticle' content type
    const entries = await client.getEntries({
      content_type: 'composeArticle',
      order: '-fields.datePublished', // Order by publish date, newest first
      // Depth 3 is correct for Article -> ImageWrapper -> ImageAsset
      include: 3
    });

    // Process entries to extract image data from the nested structure
    const articles = entries.items.map(item => {
      // Start with a copy of all fields from the Contentful item
      const articleData = { ...item.fields }; // Use a new variable name like articleData to avoid confusion

      // --- Handling the 'mainImage' field (which links to 'mediaImageAsset') ---
      if (articleData.mainImage && articleData.mainImage.fields) {
        const imageWrapper = articleData.mainImage.fields; // This is the fields of the 'mediaImageAsset' entry

        if (imageWrapper.imageFile && imageWrapper.imageFile.fields && imageWrapper.imageFile.fields.file) {
          // Extract data from the actual image Asset
          const imageAsset = imageWrapper.imageFile.fields;

          articleData.mainImage = { // Assign the processed object back to articleData.mainImage
            url: `https:${imageAsset.file.url}`, // Absolute URL for Eleventy Image
            alt: imageWrapper.imageAlternativeText || imageAsset.title || 'Image', // Use imageAlternativeText, fallback to asset title
            caption: imageWrapper.imageCaption || null,
            photographer: imageWrapper.creatorPhotographer || null,
            licence: imageWrapper.licenceInformation || null,
            details: imageAsset.file.details // Contains width, height, size etc.
          };
        } else {
          // If imageFile or its details are missing within the wrapper
          articleData.mainImage = null;
        }
      } else {
        // If no mainImage wrapper is linked
        articleData.mainImage = null;
      }

      // --- Handling 'heroImage' if it also links to 'mediaImageAsset' ---
      if (articleData.heroImage && articleData.heroImage.fields) {
        const heroImageWrapper = articleData.heroImage.fields;

        if (heroImageWrapper.imageFile && heroImageWrapper.imageFile.fields && heroImageWrapper.imageFile.fields.file) {
          const heroImageAsset = heroImageWrapper.imageFile.fields;
          articleData.heroImage = { // Assign the processed object back to articleData.heroImage
            url: `https:${heroImageAsset.file.url}`,
            alt: heroImageWrapper.imageAlternativeText || heroImageAsset.title || 'Hero Image',
            caption: heroImageWrapper.imageCaption || null,
            photographer: heroImageWrapper.creatorPhotographer || null,
            licence: heroImageWrapper.licenceInformation || null,
            details: heroImageAsset.file.details
          };
        } else {
          articleData.heroImage = null;
        }
      } else {
        articleData.heroImage = null;
      }

      // --- Add the debugging console.logs here for the slug ---
      // This will now reflect the slug *after* any potential issues with image processing (though unlikely to be related)
      // and before the final return to Eleventy.

      // Return the complete and processed articleData, including the slug
      return {
        ...articleData, // Use articleData here to include all processed fields
        slug: articleData.slug, // Ensure slug is explicitly present, though it's already in articleData
        sys: item.sys // Keep sys data for Eleventy's internal use (e.g., eleventyNavigation, if needed)
      };
    });

    return articles;

  } catch (error) {
    console.error('Error fetching data from Contentful:', error);
    return [];
  }
}
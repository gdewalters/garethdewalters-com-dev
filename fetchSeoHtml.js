import client from './_helpers/contentfulClient.js';
import parseSeo from './_helpers/parseSeo.js';
import 'dotenv/config';

async function run() {
  try {
    const entryId = process.env.PAGE_ENTRY_ID;
    if (!entryId) {
      throw new Error('PAGE_ENTRY_ID env variable is missing');
    }

    const entry = await client.getEntry(entryId, { include: 3 });
    const seoField = entry.fields.seo || entry.fields.seoMetaData;

    if (!seoField) {
      console.log('Page entry lacks SEO data');
      return;
    }

    const seo = parseSeo(seoField);
    const tags = [];

    if (seo.seoTitle) {
      tags.push(`<title>${seo.seoTitle}</title>`);
    }
    if (seo.metaDescription) {
      tags.push(`<meta name="description" content="${seo.metaDescription}">`);
    }
    if (seo.canonicalUrl) {
      tags.push(`<link rel="canonical" href="${seo.canonicalUrl}">`);
    }

    const robotsIndex = seo.seoNoIndex ? 'noindex' : 'index';
    const robotsFollow = seo.seoNoFollow ? 'nofollow' : 'follow';
    tags.push(`<meta name="robots" content="${robotsIndex},${robotsFollow}">`);

    if (seo.openGraphTitle) {
      tags.push(`<meta property="og:title" content="${seo.openGraphTitle}">`);
    }
    if (seo.openGraphDescription) {
      tags.push(`<meta property="og:description" content="${seo.openGraphDescription}">`);
    }
    if (seo.openGraphImage?.fields?.file?.url) {
      tags.push(`<meta property="og:image" content="https:${seo.openGraphImage.fields.file.url}">`);
    }
    if (seo.openGraphType) {
      tags.push(`<meta property="og:type" content="${seo.openGraphType}">`);
    }
    if (seo.openGraphLocale) {
      tags.push(`<meta property="og:locale" content="${seo.openGraphLocale}">`);
    }

    console.log(tags.join('\n'));
  } catch (err) {
    console.error('Failed to fetch SEO fields:', err);
  }
}

run();

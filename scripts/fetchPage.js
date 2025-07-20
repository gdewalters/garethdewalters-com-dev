import { createClient } from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import 'dotenv/config';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master'
});

async function run() {
  try {
    const entryId = process.env.PAGE_ENTRY_ID;
    if (!entryId) {
      throw new Error('PAGE_ENTRY_ID env variable is missing');
    }

    // include depth 3 to fetch referenced entries like rich text panel
    const page = await client.getEntry(entryId, { include: 3 });

    console.log('Page title:', page.fields.pageTitle);

    const sections = page.fields.contentSections || [];
    for (const section of sections) {
      const typeId = section.sys?.contentType?.sys?.id;
      if (typeId === 'componentRichTextPanel') {
        if (section.fields.heading) {
          console.log('\n###', section.fields.heading);
        }
        if (section.fields.standfirst) {
          console.log(section.fields.standfirst);
        }
        if (section.fields.body) {
          const html = documentToHtmlString(section.fields.body, {
            renderNode: {
              [BLOCKS.EMBEDDED_ENTRY]: (node) => {
                const entry = node.data.target;
                // Example: handle embedded assets in Rich Text
                if (entry?.sys?.contentType?.sys?.id === 'mediaImageAsset') {
                  const url = entry.fields.imageFile?.fields?.file?.url;
                  const alt = entry.fields.imageAlternativeText || '';
                  if (url) {
                    return `<img src="https:${url}" alt="${alt}">`;
                  }
                }
                return '';
              },
              [BLOCKS.EMBEDDED_ASSET]: (node) => {
                const asset = node.data.target;
                const url = asset?.fields?.file?.url;
                const alt = asset?.fields?.title || '';
                return url ? `<img src="https:${url}" alt="${alt}">` : '';
              }
            }
          });
          console.log(html);
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch page:', err);
  }
}

run();

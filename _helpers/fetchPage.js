// This script fetches a single page entry from Contentful and logs its
// contents to the console. It is useful for inspecting how data is
// structured in Contentful without setting up the full site.

import { createClient } from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import 'dotenv/config';

// Create a Contentful client using credentials from the environment.
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

// Fetch the page and output its key fields. Any errors are caught and logged.
async function run() {
  try {
    const entryId = process.env.PAGE_ENTRY_ID;
    // Ensure the script knows which page to fetch.
    if (!entryId) {
      throw new Error('PAGE_ENTRY_ID env variable is missing');
    }

    // Request the page entry and include related content up to three levels
    // deep so embedded components are available.
    const page = await client.getEntry(entryId, { include: 3 });

    // Display the page title so we know the correct entry was fetched.
    console.log('Page title:', page.fields.pageTitle);

    const sections = page.fields.contentSections || [];
    // Iterate over each content section on the page.
    for (const section of sections) {
      const typeId = section.sys?.contentType?.sys?.id;
      // Only handle sections that are Rich Text Panels.
      if (typeId === 'componentRichTextPanel') {
        // Print heading and summary text if available.
        if (section.fields.heading) {
          console.log('\n###', section.fields.heading);
        }
        if (section.fields.standfirst) {
          console.log(section.fields.standfirst);
        }
        // Convert the rich text body to HTML for display.
        if (section.fields.body) {
          const html = documentToHtmlString(section.fields.body, {
            // Custom rendering rules handle images embedded within the rich text
            // content. They return HTML strings for these nodes.
            renderNode: {
              [BLOCKS.EMBEDDED_ENTRY]: (node) => {
                const entry = node.data.target;
                // If the embedded entry is an image asset, output an <img> tag.
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
              },
            },
          });
          // Output the generated HTML so it can be reviewed in the terminal.
          console.log(html);
        }
      }
    }
  } catch (err) {
    // Print any errors that occur during the request.
    console.error('Failed to fetch page:', err);
  }
}

// Start the process when the script is run directly.
run();

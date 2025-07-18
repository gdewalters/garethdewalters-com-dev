// content/writing/writing.11tydata.js

export default {
  // Generate one page per Contentful article entry
  pagination: {
    data: "getContentfulArticles",
    size: 1,
    alias: "post",
  },
  // All files in /content/writing/ to default to this layout
  layout: "layouts/article.njk",
  // Compute permalink from each article slug


  eleventyComputed: {
    permalink: (data) => {
      console.log('--- DEBUG: Permalink function triggered for template:', data.page?.inputPath);
      console.log('  Is data.post defined?', !!data.post); // Log if data.post exists
      if (data.post) {
        // Attempt to get slug from 'fields' first, then direct 'post' object
        const articleSlug = data.post.fields?.slug || data.post.slug;
        console.log('  Attempted slug (data.post.fields?.slug || data.post.slug):', articleSlug);

        if (articleSlug) {
          const permalinkPath = `/writing/${articleSlug}/index.html`;
          console.log('  Permalink returned:', permalinkPath);
          return permalinkPath;
        } else {
          console.log('  Permalink returned: false (article slug not found)');
          return false; // Slug is missing for a paginated item
        }
      } else {
        // This branch should be hit when article.njk is processed as a standalone file
        console.log('  Permalink returned: false (data.post is undefined, likely standalone template)');
        return false; // data.post is undefined, so don't create a page
      }
    },
  },


  // If you want all files in /content/writing/ to have this tag
  tags: [
    "writing",
  ],
};
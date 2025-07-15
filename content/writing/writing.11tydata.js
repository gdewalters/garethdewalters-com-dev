// content/writing/writing.11tydata.js

export default {
  // Generate one page per composeArticle entry
  pagination: {
    data: "composeArticle",
    size: 1,
    alias: "post",
  },
  // All files in /content/writing/ to default to this layout
  layout: "layouts/article.njk",
  // Compute permalink from each article slug
  eleventyComputed: {
    permalink: (data) => {
      if (data.post && data.post.slug) {
        return `/writing/${data.post.slug}/index.html`;
      }
      return false;
    },
  },
  // If you want all files in /content/writing/ to have this tag
  tags: [
    "writing",
  ],
};
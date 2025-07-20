# eleventy-contentful-demo

This repository demonstrates pulling Contentful data into an Eleventy site.

## Proof of Concept: Fetch a Page with Rich Text

1. Copy `.env.example` to `.env` and fill in your Contentful credentials and the page entry ID to load.

2. Run the proof-of-concept script:

```bash
node scripts/fetchPage.js
```

The script outputs the page title and renders any `componentRichTextPanel` sections, converting the rich text field to HTML. Embedded image entries and assets are handled so you can see the final markup in the console.


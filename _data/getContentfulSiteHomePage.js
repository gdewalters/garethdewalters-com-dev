// _data/articles.js

// 1. Import the client from your helper file
import client from './helpers/contentfulClient.js';

// 2. Define your asynchronous function that fetches the data
export default async function() {
  try {
    // 3. Use the imported 'client' object to make your query
    const entries = await client.getEntries({
      content_type: 'page',
      // ... your query options ...
    });

    // 4. Return the processed data
    return entries.items;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}
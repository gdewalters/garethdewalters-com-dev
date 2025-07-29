// _data/helpers/contentfulClient.js    
// This file sets up the Contentful client using environment variables
// It exports the client for use in other parts of the application.

import { createClient } from 'contentful';
import 'dotenv/config'; // Ensure dotenv is configured to load your env vars

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!spaceId || !accessToken) {
  throw new Error('Contentful credentials (SPACE_ID, ACCESS_TOKEN) are required.');
}

const client = createClient({
  space: spaceId,
  accessToken: accessToken,
  environment: environment,
});

export default client;
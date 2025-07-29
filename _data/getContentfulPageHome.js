import { getContentfulPageBySlug } from './getContentfulPageBySlug.js';

export default async function () {
  return getContentfulPageBySlug('home');
}

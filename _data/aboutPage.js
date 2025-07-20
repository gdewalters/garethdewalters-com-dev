import getContentfulPages from './getContentfulPages.js';

export default async function () {
  // See _data/models/contentfulPageEntryAbout.json for a sample entry shape.
  const pages = await getContentfulPages();
  return pages.find((p) => p.sys && p.sys.id === '6Q96jcdFbNmzlFw6rkjuI3');
}

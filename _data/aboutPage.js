import getContentfulPages from './getContentfulPages.js';

export default async function () {
  const pages = await getContentfulPages();
  const page = pages.find((p) => p.sys && p.sys.id === '6Q96jcdFbNmzlFw6rkjuI3');
  console.debug('About page data:', page);
  return page;
}

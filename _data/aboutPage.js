import getContentfulPages from './getContentfulPages.js';

export default async function () {
  const pages = await getContentfulPages();
  return pages.find((p) => p.sys && p.sys.id === '6Q96jcdFbNmzlFw6rkjuI3');
}

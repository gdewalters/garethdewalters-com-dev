export default function parseSeo(entry) {
  const fields = entry?.fields || {};

  return {
    seoTitle: fields.seoTitle || null,
    metaDescription: fields.metaDescription || null,
    canonicalUrl: fields.canonicalUrl || null,
    seoNoIndex: fields.seoNoIndex ?? null,
    seoNoFollow: fields.seoNoFollow ?? null,
    openGraphTitle: fields.openGraphTitle || null,
    openGraphDescription: fields.openGraphDescription || null,
    openGraphImage: fields.openGraphImage || null,
    openGraphType: fields.openGraphType || null,
    openGraphLocale: fields.openGraphLocale || null,
  };
}


export const helperDto = (rawData, mapper) => {
    if (!rawData) return null;

    const id = rawData.id || null;
    const attributes = rawData.attributes || {};

    /* Пропсы */
    const properties = rawData?.attributes.properties || {};
    const brand = properties.properties || {};

    /* Продукт */
    const product = attributes?.product || {};
    const price = product?.price || {};
    const storesItems = product?.stores?.items || {};

    /* Общее */
    const links = rawData?.links || {};
    const relationships = rawData?.relationships || {};
    const meta = rawData?.meta || {};

    // Обычно included приходит массивом
    const included = rawData?.included || [];

    return mapper({
        id,
        attributes,
        properties,
        brand,
        product,
        price,
        links,
        storesItems,
        relationships,
        meta,
        included
    });
};
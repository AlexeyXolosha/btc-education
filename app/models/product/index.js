import {helperDto} from "~/models/helper.js";

export const productDTO = (rawData) => {
    return helperDto(rawData, ({id, attributes, storesItems, relationships, price, links, included}) => {
        const image = attributes?.image || null;
        const name = attributes?.name || "";
        const inStockCount = Object.keys(storesItems).length;
        const priceValue = price?.valueFormatted || "0";
        const stikers = attributes?.stikers || [];

        const reviewsStats = included?.['reviews-statistics'] || [];
        const statsEntry = reviewsStats.find((s) => String(s.id) === String(id));
        const reviewsStatics = statsEntry
            ? {rating: statsEntry.attributes?.rating ?? 0, count: statsEntry.count ?? 0}
            : null;

        return {
            id,
            name,
            inStockCount,
            image,
            priceValue,
            links,
            stikers,
            reviewsStatics
        };
    })
}

export const ProductDetailDTO = (rawData) => {
    return helperDto(rawData, ({id, meta, attributes, properties}) => {
        const breadcrumbs = meta?.breadcrumb || [];
        const name = attributes?.name || "";
        const stikers = attributes?.stikers || [];
        const article = properties?.cml2Article?.value || "";

        const brand = attributes?.brand[0]?.attributes || [];
        const brandImage = brand?.images?.preview || "";

        const images = attributes?.images?.more || [];

        const tizers = attributes?.tizers || [];
        const tabs = attributes?.tabs || {};

        return {
            id,
            article,
            breadcrumbs,
            name,
            stikers,
            images,
            tizers,
            tabs,
            brand,
            brandImage
        };
    })
}

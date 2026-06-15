export const sliderDTO = (rawData) => {
    if (!rawData) return null;

    const attributes = rawData?.attributes || {};

    const text = attributes?.text || {};
    const images = attributes?.images || {};
    const video = attributes?.video || {};
    const styles = attributes?.styles || {};
    const links = attributes?.links || {};

    return {
        id: rawData.id,
        name: attributes?.name || "",

        // text
        title: text?.title || "",
        description: text?.text || "",
        button1Text: text?.button_1_text || "",
        button2Text: text?.button_2_text || "",

        // images
        imageDesktop: images?.desktop?.src || "",
        imageMobile: images?.mobile?.src || "",
        imageMobFallback: images?.mob_image || "",
        imagePreview: images?.preview || "",

        // video
        videoDesktop: video?.desktop?.src || "",
        videoMobile: video?.mobile?.src || "",

        // styles
        textPosition: styles?.text_positon || "",
        textColor: styles?.text_color || "",
        button1Class: styles?.button_1_class || "",
        button2Class: styles?.button_2_class || "",

        // links
        bannerLink: links?.banner_link || "",
        button1Link: links?.button_1_link || "",
        button2Link: links?.button_2_link || "",

        // stickers
        stickers: Array.isArray(attributes?.sticker) ? attributes.sticker : []
    };
};
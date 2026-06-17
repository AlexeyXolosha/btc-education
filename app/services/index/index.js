import {useFetchHook} from "~/composables/fetch/useFetchHook.js";
import {sliderDTO} from "~/models/slider.js";

export default {

    async GET_HERO_SLIDER() {
        return await useFetchHook(
            '/include/banners/slider/',
            {method: 'GET'},
            'slider-hero',
            null,
            (raw) => ({...raw, data: raw.data?.map(sliderDTO)})
        )
    },

    async GET_HERO_ADVANTAGES() {
        return await useFetchHook('/include/mainpage/advantages/', {method: 'GET'}, 'advantages-hero')
    },

    PRODUCT_HITS: {
        key: 'hits',
        fetch: () => useFetchHook('/include/mainpage/hit/hit/', {method: 'GET'}, 'hits'),
    },

    PRODUCT_STOCK: {
        key: 'stock',
        fetch: () => useFetchHook('/include/mainpage/hit/stock/', {method: 'GET'}, 'stock'),
    },

    PRODUCT_RECOMMENDATIONS: {
        key: 'recommendations',
        fetch: () => useFetchHook('/include/mainpage/hit/recommend/', {method: 'GET'}, 'recommendations'),
    },

}
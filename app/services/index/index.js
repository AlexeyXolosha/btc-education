import {useFetchHook} from "~/composables/fetch/useFetchHook.js";
import {sliderDTO} from "~/models/slider.js";

export default {

    async GET_HERO_SLIDER() {
        return await useFetchHook(
            '/include/banners/slider/',
            {method: 'GET', lazy: true},
            'slider-hero',
            30000,
            (raw) => ({...raw, data: raw.data?.map(sliderDTO)})
        )
    },

    async GET_HERO_ADVANTAGES() {
        return await useFetchHook('/include/mainpage/advantages/', {method: 'GET'}, 'advantages-hero')
    }

}
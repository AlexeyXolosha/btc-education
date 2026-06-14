import {useFetchHook} from "~/composables/fetch/useFetchHook.js";

export default {

    async GET_HERO_SLIDER() {
        return await useFetchHook('/include/banners/slider/', {method: 'GET', lazy: true}, 'slider-hero')
    },

    async GET_HERO_ADVANTAGES() {
        return await useFetchHook('/include/mainpage/advantages/', {method: 'GET'}, 'advantages-hero')
    }

}
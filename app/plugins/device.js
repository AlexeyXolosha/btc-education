import {useDeviceState} from "~/composables/useDeviceState.js";

export default defineNuxtPlugin(() => {
    const {isMobile} = useDeviceState();

    if (import.meta.server) {
        const ua = useRequestHeaders(['user-agent'])['user-agent'] || '';
        isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    }
});
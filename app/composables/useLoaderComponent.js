import {useDeviceState} from "~/composables/useDeviceState.js";
import {defineAsyncComponent, computed, h} from 'vue';

const allTemplates = import.meta.glob('~/components/**/templates/**/*.vue');

const EmptyComponent = defineAsyncComponent(() =>
    Promise.resolve({render: () => h('div', {style: 'display:none'})})
);

export const useLoaderComponent = (componentFolder, template = 'default') => {
    const {isMobile} = useDeviceState();

    const getComponentLoader = (deviceType) => {
        const searchKey = `/${componentFolder}/templates/${template}/${deviceType}.vue`;

        const foundKey = Object.keys(allTemplates).find(path =>
            path.toLowerCase().includes(searchKey.toLowerCase())
        );

        if (!foundKey) return null;

        return defineAsyncComponent(allTemplates[foundKey]);
    };

    const MobileComp = getComponentLoader('mobile');
    const DesktopComp = getComponentLoader('desktop');

    const currentComponent = computed(() => {
        if (import.meta.server) {
            return isMobile.value ? MobileComp : DesktopComp;
        }

        return isMobile.value
            ? (MobileComp || EmptyComponent)
            : (DesktopComp || EmptyComponent);
    });

    return {currentComponent};
}
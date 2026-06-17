import {useFetchClient} from "~/composables/fetch/useFetchClient.js";
import {useFetchHook} from "~/composables/fetch/useFetchHook.js";
import {useCachedData} from "~/composables/fetch/useCashedData.js";
import {productDTO} from "~/models/product/index.js";

export const categoryCompose = (key = "product") => {
    const cache = useCachedData(key);
    const activeCategory = useState(`${key}:active`, () => null);

    const productListDTO = (raw) => ({
        ...raw,
        data: raw?.data?.map((item) => productDTO({...item, included: raw.included})) ?? [],
    });

    const {execute} = useFetchClient(null, {method: "GET"}, key, null, productListDTO);

    const fetchInitial = async (url, categoryId) => {
        if (!url) return;
        activeCategory.value = categoryId;
        await useFetchHook(url, {method: "GET"}, key, null, productListDTO);
    };

    const fetchProduct = async (item) => {
        const url = item?.links?.self;
        if (!url || activeCategory.value === item?.id) return;
        activeCategory.value = item.id;
        await execute(url, true);
    };

    return {
        activeCategory,
        data: cache.data,
        loading: cache.loading,
        error: cache.error,
        fetchInitial,
        fetchProduct,
    };
};
import {useFetchClient} from "~/composables/fetch/useFetchClient.js";
import {useFetchHook} from "~/composables/fetch/useFetchHook.js";
import {productDTO} from "~/models/product/index.js";

export const categoryCompose = (key = "product") => {

    const activeCategory = useState(`${key}:active`, () => null);
    const productListDTO = (raw) => ({
        ...raw,
        data: raw.data?.map((item) => productDTO({...item, included: raw.included})),
    });
    const { execute } = useFetchClient(null, { method: "GET" }, key, null, productListDTO);

    const fetchInitial = async (url, categoryID) => {
        activeCategory.value = categoryID;
        if (url) {
            await useFetchHook(url, { method: "GET" }, key, null, productListDTO);
        }
    }

    const fetchProduct = async (item) => {
        if (!item?.links?.self || activeCategory.value === item.id) return false;

        activeCategory.value = item.id;
        await execute(item.links.self, true);
    }

    return { activeCategory, fetchInitial, fetchProduct };
}

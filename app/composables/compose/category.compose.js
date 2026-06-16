export const categoryCompose = async (categoryUrl, ns) => {

    const activeCategory = ref(null);

    const fetchProduct = async (item) => {
        if (!item?.links?.self) return false;
    }
}
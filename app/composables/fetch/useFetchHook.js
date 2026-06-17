import { useCachedData } from "~/composables/fetch/useCashedData.js";

export const useFetchHook = async (url, options, fetchKey, ttl, transformFunc) => {
    const config = useRuntimeConfig();
    const key = fetchKey;
    const cache = useCachedData(key);

    const res = await useFetch(url, {
        ...options,
        key,
        $fetch: useRequestFetch(),
        baseURL: config.public.BASE_URL,
        method: options?.method || 'GET',
        body: options?.body || undefined,

        getCachedData: () => (cache.has() ? cache.data.value : undefined),

        transform: (fetchedData) => {
            const transformed = transformFunc ? transformFunc(fetchedData) : fetchedData;
            cache.set(transformed, ttl);
            return transformed;
        }
    });

    const syncStatus = () => {
        cache.setLoading(res.pending.value);
        cache.setError(res.error.value);
    };

    watch([res.pending, res.error], syncStatus, { immediate: true });

    return {
        data: res.data,
        error: cache.error,
        loading: cache.loading,
        refresh: res.refresh,
        execute: res.execute,
        status: res.status,
    };
}
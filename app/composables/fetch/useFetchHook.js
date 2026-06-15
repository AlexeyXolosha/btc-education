import {useCachedData} from "~/composables/fetch/useCashedData.js";

export const useFetchHook = async (url, options, fetchKey, ttl, transform) => {
    const config = useRuntimeConfig();
    const key = fetchKey;
    const cache = useCachedData(key)
    const lazy = options?.lazy ?? false

    const res = useFetch(url, {
        ...options,
        key,
        $fetch: useRequestFetch(),
        baseURL: config.public.BASE_URL,
        method: options?.method || 'GET',
        body: options?.body || undefined,
        getCachedData: () => (cache.has() ? cache.data.value ?? undefined : undefined)
    })

    if (!lazy) await res

    const sync = () => {
        cache.setLoading(res.pending.value)
        cache.setError(res.error.value)
        if (res.data.value != null && res.data.value !== cache.data.value) {
            const transformed = transform ? transform(res.data.value) : res.data.value
            cache.set(transformed, ttl)
        }
    }

    watch([res.data, res.pending, res.error], sync, {immediate: true})

    return {
        data: cache.data,
        error: cache.error,
        loading: cache.loading,
        refresh: res.refresh,
        execute: res.execute,
        status: res.status,
    }
}
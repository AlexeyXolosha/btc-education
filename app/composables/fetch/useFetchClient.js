import {useCachedData} from "~/composables/fetch/useCashedData.js"

export const useFetchClient = (url, options = {}, fetchKey, ttl, transform) => {
    const config = useRuntimeConfig()
    const key = fetchKey
    const cache = useCachedData(key)
    const _fetch = useRequestFetch()

    const execute = async (overrideUrl, force = false) => {
        const target = overrideUrl ?? url
        if (!force && cache.has()) return cache.data.value

        cache.setLoading(true)
        cache.setError(null)

        const [err, raw] = await _fetch(target, {
            ...options,
            baseURL: config.public.BASE_URL,
            method: options?.method || 'GET',
            body: options?.body ?? undefined,
        })
            .then(data => [null, data])
            .catch(error => [error, null])

        cache.setLoading(false)

        if (err) {
            cache.setError(err)
            return undefined
        }

        const transformed = transform ? transform(raw) : raw
        cache.set(transformed, ttl)
        return transformed
    }

    return {
        data: cache.data,
        error: cache.error,
        loading: cache.loading,
        refresh: () => execute(undefined, true),
        execute,
    }
}
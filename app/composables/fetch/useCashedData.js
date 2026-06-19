const DEFAULT_TTL = 1000 * 60 * 5;

export const useCachedData = (key) => {
    const storage = useState('storage:data', () => ({}))
    const loaders = useState('storage:loaders', () => ({}))
    const errors = useState('storage:errors', () => ({}))
    const expires = useState('storage:expires', () => ({}))
    const ids = useState('storage:ids', () => ({}))

    const isStale = () => {
        const exp = expires.value[key]
        return exp != null && Date.now() > exp
    }

    const data = computed(() => storage.value[key] ?? null)
    const error = computed(() => errors.value[key] ?? null)
    const loading = computed(() => loaders.value[key] ?? false)

    const set = (value, ttl = DEFAULT_TTL, id) => {
        storage.value[key] = value
        expires.value[key] = ttl ? Date.now() + ttl : null
        ids.value[key] = id
    }

    const setLoading = (v) => {
        loaders.value[key] = v
    }
    const setError = (v) => {
        errors.value[key] = v
    }

    const has = (id) => storage.value[key] != null && !isStale() && (id === undefined || ids.value[key] === id)

    const remove = () => {
        delete storage.value[key]
        delete loaders.value[key]
        delete errors.value[key]
        delete expires.value[key]
        delete ids.value[key]
    }

    return {data, error, loading, set, setLoading, setError, has, remove}
}
export const useApiUrl = (path = "") => {
    const {public: {BASE_URL}} = useRuntimeConfig()

    if (!path) return BASE_URL

    const base = BASE_URL.replace(/\/$/, "")
    const tail = String(path).replace(/^\//, "")

    return `${base}/${tail}`
}

export function useResponsiveCss(props) {
    const uid = useId()
    const responsiveCss = computed(() => {
        const base = `.sw-${uid}{--spv:${Number(props.slidesPerView) || 1};--sw-gap:${props.gap}px}`
        const mq = Object.entries(props.breakpoints || {})
            .sort((a, b) => a[0] - b[0])
            .map(([min, c]) => {
                const p = []
                if (c.slidesPerView != null) p.push(`--spv:${c.slidesPerView}`)
                if (c.gap != null) p.push(`--sw-gap:${c.gap}px`)
                return `@media(min-width:${min}px){.sw-${uid}{${p.join(';')}}}`
            }).join('')
        return base + mq
    })
    return { uid, responsiveCss }
}
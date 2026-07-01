export function useBreakpoints(props) {
    const uid = useId()

    const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : null)

    const css = computed(() => {
        const sel = `[data-sw="${uid}"]`

        const spvBase = num(props.slidesPerView) ?? 1
        const gapBase = num(props.gap) ?? 16
        const base = `${sel}{--spv:${spvBase};--sw-gap:${gapBase}px}`

        const mq = Object.entries(props.breakpoints || {})
            .map(([min, val]) => [num(min), val])
            .filter(([min]) => min !== null)
            .sort((a, b) => a[0] - b[0])
            .map(([min, val]) => {
                const spv = num(typeof val === 'object' ? val.slidesPerView : val)
                const gap = num(typeof val === 'object' ? val.gap : undefined)

                const decls = []
                if (spv !== null) decls.push(`--spv:${spv}`)
                if (gap !== null) decls.push(`--sw-gap:${gap}px`)

                return decls.length
                    ? `@media(min-width:${min}px){${sel}{${decls.join(';')}}}`
                    : ''
            })
            .join('')

        return base + mq
    })

    return {uid, css}
}
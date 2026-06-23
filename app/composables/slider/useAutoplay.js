export function useAutoplay(autoplay, { currentIndex, maxIndex, next, goTo, reducedMotion }) {
    const cfg = computed(() => autoplay.value
        ? { delay: 4000, pauseOnHover: true, ...(typeof autoplay.value === 'object' ? autoplay.value : {}) }
        : null)
    let timer = null

    const start = () => {
        if (!cfg.value || reducedMotion.value || timer) return
        timer = setInterval(() => {
            currentIndex.value >= maxIndex.value ? goTo(0) : next()
        }, cfg.value.delay)
    }
    const stop = () => { if (timer) { clearInterval(timer); timer = null } }
    const onHoverPause = () => { if (cfg.value?.pauseOnHover) stop() }
    const onHoverResume = () => { if (cfg.value?.pauseOnHover) start() }
    const onVisibility = () => { document.hidden ? stop() : start() }

    onMounted(() => { document.addEventListener('visibilitychange', onVisibility); start() })
    onBeforeUnmount(() => { document.removeEventListener('visibilitychange', onVisibility); stop() })

    return { start, stop, onHoverPause, onHoverResume }
}
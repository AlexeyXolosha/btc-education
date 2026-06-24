export function usePagination({currentIndex, maxIndex, goTo}) {
    const bullets = computed(() => Array.from({length: maxIndex.value + 1}, (_, i) => i))

    const isActive = (i) => i === currentIndex.value
    const select = (i) => goTo(i)

    return {bullets, isActive, select}
}
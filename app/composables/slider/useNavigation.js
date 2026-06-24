export function useNavigation({currentIndex, maxIndex, prev, next}) {
    const canPrev = computed(() => currentIndex.value > 0)
    const canNext = computed(() => currentIndex.value < maxIndex.value)

    return {canPrev, canNext, prev, next}
}
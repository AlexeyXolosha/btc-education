export function useNavigation({
                                  currentIndex,
                                  viewIndex,
                                  maxIndex,
                                  scrollOnly,
                                  prev,
                                  next,
                                  scrollPrev,
                                  scrollNext
                              }) {
    const targetIndex = computed(() =>
        scrollOnly?.value ? viewIndex.value : currentIndex.value
    );

    const canPrev = computed(() => targetIndex.value > 0);
    const canNext = computed(() => targetIndex.value < maxIndex.value);

    const onPrev = () => {
        scrollOnly?.value ? scrollPrev() : prev();
    };

    const onNext = () => {
        scrollOnly?.value ? scrollNext() : next();
    };

    return { canPrev, canNext, onPrev, onNext };
}
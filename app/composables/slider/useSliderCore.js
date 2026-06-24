export function useSliderCore(wrapper, props, emit) {
    const translate = ref(0);
    const currentIndex = ref(props.modelValue || 0);
    const isDragging = ref(false);
    const slideStep = ref(0);
    const maxTranslate = ref(0);
    const maxIndex = ref(0);
    let ro = null;

    const applyTranslate = (i) => {
        translate.value = Math.max(-maxTranslate.value, -i * slideStep.value)
    }

    /* Перемещение к слайду  */
    const goTo = (index) => {
        const i = Math.max(0, Math.min(index, maxIndex.value))
        const changed = i !== currentIndex.value
        currentIndex.value = i
        applyTranslate(i)
        if (changed) {
            emit('update:modelValue', i);
            emit('slide-change', i)
        }
    }

    /* Функции перемещение к слайдам  */
    const next = () => goTo(currentIndex.value + 1)
    const prev = () => goTo(currentIndex.value - 1)

    /* Вызывается при монтировании и при каждом ресайзе, заново считает физические размеры */
    const measure = () => {
        const el = wrapper.value
        if (!el?.children.length) return
        const gap = parseFloat(getComputedStyle(el).columnGap) || 0
        slideStep.value = el.children[0].offsetWidth + gap
        maxTranslate.value = Math.max(0, el.scrollWidth - el.parentElement.clientWidth)
        maxIndex.value = slideStep.value ? Math.round(maxTranslate.value / slideStep.value) : 0
        if (currentIndex.value > maxIndex.value) currentIndex.value = maxIndex.value
        applyTranslate(currentIndex.value)
    }


    onMounted(() => {
        measure()
        ro = new ResizeObserver(measure)
        ro.observe(wrapper.value)
    })

    onBeforeUnmount(() => ro?.disconnect())

    watch(() => props.items?.length, () => nextTick(measure))

    return {translate, currentIndex, isDragging, slideStep, maxIndex, goTo, next, prev, measure}
}
export function useSliderCore(wrapper, props, emit) {
    const translate = ref(0);
    const currentIndex = ref(props.modelValue || 0);
    const viewIndex = ref(props.modelValue || 0);
    const isDragging = ref(false);
    const slideStep = ref(0);
    const maxTranslate = ref(0);

    const baseSpv = () => {
        const n = Number(props.slidesPerView)
        return Number.isFinite(n) && n > 0 ? n : 1
    }
    const estimateMaxIndex = () => Math.max(0, Math.ceil((props.items?.length || 0) - baseSpv()))

    const maxIndex = ref(estimateMaxIndex());
    let ro = null;

    const applyTranslate = (i) => {
        translate.value = Math.max(-maxTranslate.value, -i * slideStep.value)
    }

    const goTo = (index) => {
        const i = Math.max(0, Math.min(index, maxIndex.value))
        const changed = i !== currentIndex.value
        currentIndex.value = i
        viewIndex.value = i
        applyTranslate(i)
        if (changed) {
            emit('update:modelValue', i);
            emit('slide-change', i)
        }
    }

    const scrollTo = (index) => {
        const i = Math.max(0, Math.min(index, maxIndex.value))
        viewIndex.value = i
        applyTranslate(i)
    }

    const next = () => goTo(currentIndex.value + 1)
    const prev = () => goTo(currentIndex.value - 1)

    const scrollNext = () => scrollTo(viewIndex.value + 1)
    const scrollPrev = () => scrollTo(viewIndex.value - 1)

    const measure = () => {
        const el = wrapper.value
        if (!el?.children.length) return

        const isColumn = props.column
        const style = getComputedStyle(el)
        const gap = parseFloat(isColumn ? style.rowGap : style.columnGap) || 0

        const first = el.children[0]
        const itemSize = isColumn ? first.offsetHeight : first.offsetWidth
        slideStep.value = itemSize + gap

        const full = isColumn ? el.scrollHeight : el.scrollWidth
        const view = isColumn ? el.parentElement.clientHeight : el.parentElement.clientWidth
        maxTranslate.value = Math.max(0, full - view)

        maxIndex.value = slideStep.value ? Math.ceil(maxTranslate.value / slideStep.value) : 0
        if (currentIndex.value > maxIndex.value) currentIndex.value = maxIndex.value
        if (viewIndex.value > maxIndex.value) viewIndex.value = maxIndex.value

        applyTranslate(viewIndex.value)
    }

    const observe = () => {
        if (!ro || !wrapper.value) return
        ro.disconnect()
        ro.observe(wrapper.value)
        const first = wrapper.value.children[0]
        if (first) ro.observe(first)
    }

    onMounted(() => {
        ro = new ResizeObserver(() => measure())
        observe()
        requestAnimationFrame(measure)
    })

    onBeforeUnmount(() => ro?.disconnect())

    watch(() => props.items?.length, () => {
        maxIndex.value = estimateMaxIndex()
        nextTick(() => { observe(); measure() })
    })
    watch(() => props.column, () => nextTick(measure))
    watch(() => props.slidesPerView, () => nextTick(measure))
    watch(() => props.modelValue, (newVal) => {
        if (newVal !== undefined && newVal !== currentIndex.value) {
            goTo(newVal);
        }
    })

    return {
        translate, currentIndex, viewIndex, isDragging, slideStep, maxTranslate, maxIndex,
        goTo, scrollTo, next, prev, scrollNext, scrollPrev, measure
    }
}
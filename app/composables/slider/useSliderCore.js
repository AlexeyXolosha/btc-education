export function useSliderCore(wrapper, props, emit) {
    const translate = ref(0);
    const currentIndex = ref(props.modelValue || 0);
    const viewIndex = ref(props.modelValue || 0);
    const isDragging = ref(false);
    const maxTranslate = ref(0);

    // реальные точки привязки (смещение левого/верхнего края каждой карточки),
    // последняя точка всегда выровнена по концу — крайняя карточка не режется
    const snaps = ref([0]);

    const baseSpv = () => {
        const n = Number(props.slidesPerView)
        return Number.isFinite(n) && n > 0 ? n : 1
    }

    const estimateMaxIndex = () => Math.max(0, Math.ceil((props.items?.length || 0) - baseSpv()))

    const maxIndex = ref(estimateMaxIndex());
    let ro = null;

    const offsetAt = (i) => {
        const points = snaps.value
        const idx = Math.max(0, Math.min(i, points.length - 1))
        return points[idx] ?? 0
    }

    const applyTranslate = (i) => {
        translate.value = -offsetAt(i)
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

        // базовая точка отсчёта — край wrapper'а; разница (карточка − wrapper)
        // не зависит от текущего transform, т.к. оба сдвинуты одинаково
        const wrapRect = el.getBoundingClientRect()
        const base = isColumn ? wrapRect.top : wrapRect.left

        const points = [...el.children].map((c) => {
            const r = c.getBoundingClientRect()
            return (isColumn ? r.top : r.left) - base
        })

        const full = isColumn ? el.scrollHeight : el.scrollWidth

        const parent = el.parentElement
        const pStyle = getComputedStyle(parent)
        const padX = (parseFloat(pStyle.paddingLeft) || 0) + (parseFloat(pStyle.paddingRight) || 0)
        const padY = (parseFloat(pStyle.paddingTop) || 0) + (parseFloat(pStyle.paddingBottom) || 0)

        const view = isColumn
            ? parent.clientHeight - padY
            : parent.clientWidth - padX

        maxTranslate.value = Math.max(0, full - view)

        const list = points.filter((p) => p < maxTranslate.value - 0.5)
        list.push(maxTranslate.value)
        snaps.value = list.length ? list : [0]

        maxIndex.value = snaps.value.length - 1
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
        nextTick(() => {
            observe();
            measure()
        })
    })

    watch(() => props.column, () => nextTick(measure))
    watch(() => props.slidesPerView, () => nextTick(measure))
    watch(() => props.modelValue, (newVal) => {
        if (newVal !== undefined && newVal !== currentIndex.value) {
            goTo(newVal);
        }
    })

    return {
        translate, currentIndex, viewIndex, isDragging, snaps, maxTranslate, maxIndex,
        goTo, scrollTo, next, prev, scrollNext, scrollPrev, measure
    }
}

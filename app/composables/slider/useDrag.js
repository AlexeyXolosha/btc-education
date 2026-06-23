export function useDrag({ wrapper, translate, isDragging, slideStep, onStart, onSettle }) {
    const moved = ref(false)
    let startX = 0, startTranslate = 0, pointerId = null

    const onDown = (e) => {
        isDragging.value = true; moved.value = false; pointerId = e.pointerId
        wrapper.value.setPointerCapture(pointerId)
        startX = e.clientX; startTranslate = translate.value
        onStart?.()
    }
    const onMove = (e) => {
        if (!isDragging.value) return
        const d = e.clientX - startX
        if (Math.abs(d) > 5) moved.value = true
        translate.value = startTranslate + d
    }
    const onUp = () => {
        if (!isDragging.value) return
        isDragging.value = false
        if (pointerId != null) { wrapper.value.releasePointerCapture?.(pointerId); pointerId = null }
        onSettle?.(slideStep.value ? Math.round(-translate.value / slideStep.value) : 0)
    }
    const onClickCapture = (e) => {
        if (moved.value) { e.stopPropagation(); e.preventDefault(); moved.value = false }
    }
    return { moved, onDown, onMove, onUp, onClickCapture }
}
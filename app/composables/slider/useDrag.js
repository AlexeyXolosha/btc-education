const AXIS_THRESHOLD = 8

export function useDrag({ wrapper, translate, isDragging, slideStep, onStart, onSettle }) {
    const moved = ref(false)
    let startX = 0, startY = 0, startTranslate = 0, pointerId = null
    let axis = null

    const onDown = (e) => {
        pointerId = e.pointerId
        startX = e.clientX; startY = e.clientY
        startTranslate = translate.value
        axis = null; moved.value = false
    }
    const onMove = (e) => {
        if (pointerId == null) return
        const dx = e.clientX - startX
        const dy = e.clientY - startY

        if (axis === null) {
            if (Math.abs(dx) < AXIS_THRESHOLD && Math.abs(dy) < AXIS_THRESHOLD) return
            axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
            if (axis === 'x') {
                isDragging.value = true
                wrapper.value.setPointerCapture?.(pointerId)
                onStart?.()
            } else {
                pointerId = null
                return
            }
        }

        moved.value = true
        translate.value = startTranslate + dx
    }
    const onUp = () => {
        const wasDragging = isDragging.value
        if (pointerId != null) { wrapper.value.releasePointerCapture?.(pointerId); pointerId = null }
        isDragging.value = false
        axis = null
        if (wasDragging) onSettle?.(slideStep.value ? Math.round(-translate.value / slideStep.value) : 0)
    }
    const onClickCapture = (e) => {
        if (moved.value) { e.stopPropagation(); e.preventDefault(); moved.value = false }
    }
    return { moved, onDown, onMove, onUp, onClickCapture }
}
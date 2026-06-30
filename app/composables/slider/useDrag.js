const AXIS_THRESHOLD = 8
const SWIPE_THRESHOLD = 0.2

const nearest = (points, value) => {
    let target = 0, best = Infinity
    for (let i = 0; i < points.length; i++) {
        const d = Math.abs(points[i] - value)
        if (d < best) { best = d; target = i }
    }
    return target
}

export function useDrag({wrapper, translate, isDragging, snaps, maxTranslate, column, onStart, onSettle}) {
    const moved = ref(false)
    let startX = 0, startY = 0, startTranslate = 0, pointerId = null
    let axis = null

    const onDown = (e) => {
        pointerId = e.pointerId
        startX = e.clientX
        startY = e.clientY
        startTranslate = translate.value
        axis = null
        moved.value = false
    }

    const onMove = (e) => {
        if (pointerId == null) return
        const dx = e.clientX - startX
        const dy = e.clientY - startY

        const mainAxis = column?.value ? 'y' : 'x'

        if (axis === null) {
            if (Math.abs(dx) < AXIS_THRESHOLD && Math.abs(dy) < AXIS_THRESHOLD) return

            axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'

            if (axis === mainAxis) {
                isDragging.value = true
                wrapper.value.setPointerCapture?.(pointerId)
                onStart?.()
            } else {
                pointerId = null
                return
            }
        }

        moved.value = true
        const delta = column?.value ? dy : dx

        const raw = startTranslate + delta
        const max = maxTranslate?.value ?? 0
        translate.value = Math.min(0, Math.max(-max, raw))
    }

    const onUp = () => {
        const wasDragging = isDragging.value
        if (pointerId != null) {
            wrapper.value.releasePointerCapture?.(pointerId)
            pointerId = null
        }
        isDragging.value = false
        axis = null

        if (wasDragging) {
            const points = snaps?.value ?? []
            if (points.length < 2) { onSettle?.(0); return }

            const pos = -translate.value
            const startPos = -startTranslate
            const base = nearest(points, startPos)
            let target = nearest(points, pos)

            // лёгкий флик: даже если ближайшая точка — стартовая,
            // сдвиг больше доли локального шага должен пролистнуть на одну карточку
            if (target === base) {
                const dir = pos - startPos
                const nextI = dir > 0 ? base + 1 : base - 1
                if (nextI >= 0 && nextI < points.length) {
                    const localStep = Math.abs(points[nextI] - points[base]) || 1
                    if (Math.abs(dir) > SWIPE_THRESHOLD * localStep) target = nextI
                }
            }

            onSettle?.(target)
        }
    }

    const onClickCapture = (e) => {
        if (moved.value) {
            e.stopPropagation()
            e.preventDefault()
            moved.value = false
        }
    }

    return {moved, onDown, onMove, onUp, onClickCapture}
}
import {useSliderCore} from "~/composables/slider/useSliderCore.js";
import {useDrag} from "~/composables/slider/useDrag.js";
import {useAutoplay} from "~/composables/slider/useAutoplay.js";
import {useReducedMotion} from "~/composables/slider/useReducedMotion.js";
import {usePagination} from "~/composables/slider/usePagination.js";
import {useNavigation} from "~/composables/slider/useNavigation.js";
import {useBreakpoints} from "~/composables/slider/useBreakpoints.js";

export function useSlider(props, emit) {
    const mounted = ref(false);
    const wrapper = ref(null);

    const reducedMotion = useReducedMotion();

    const navObject = computed(() =>
        typeof props.navigation === 'object' && props.navigation !== null ? props.navigation : null
    );
    const isScrollOnly = computed(() => !!navObject.value?.scrollOnly);

    const {
        translate, currentIndex, viewIndex, isDragging, slideStep, maxTranslate, maxIndex,
        goTo, scrollTo, next, prev, scrollNext, scrollPrev
    } = useSliderCore(wrapper, props, emit);

    // навигация имеет смысл, только если есть куда листать (замер из реальной геометрии)
    const hasNavigation = computed(() => props.navigation !== false && maxIndex.value > 0);

    const {uid, css} = useBreakpoints(props);
    useHead({style: [{innerHTML: css}]});

    const {start: startAutoplay, stop: stopAutoplay, reset: resetAutoplay, onHoverPause, onHoverResume} = useAutoplay(
        computed(() => props.autoplay),
        {currentIndex, maxIndex, next, goTo, reducedMotion}
    );

    const {onDown, onMove, onUp, onClickCapture} = useDrag({
        wrapper,
        translate,
        isDragging,
        slideStep,
        maxTranslate,
        column: computed(() => props.column),
        onStart: stopAutoplay,
        onSettle: (index) => {
            isScrollOnly.value ? scrollTo(index) : goTo(index);
            startAutoplay();
        },
    });

    onMounted(() => {
        mounted.value = true;
    });

    const {bullets, isActive, select} = usePagination({currentIndex, maxIndex, goTo});

    const {canPrev, canNext, onPrev, onNext} = useNavigation({
        currentIndex,
        viewIndex,
        maxIndex,
        scrollOnly: isScrollOnly,
        prev,
        next,
        scrollPrev,
        scrollNext
    });

    const handleNextClick = () => {
        onNext();
        resetAutoplay();
    };

    const handlePrevClick = () => {
        onPrev();
        resetAutoplay();
    };

    const onSelect = (i) => {
        select(i);
        resetAutoplay();
    };

    return {
        wrapper, uid, reducedMotion, translate, isDragging,
        mounted, bullets, isActive, onSelect,
        hasNavigation, canPrev, canNext, handlePrevClick, handleNextClick,
        onHoverPause, onHoverResume, onDown, onMove, onUp, onClickCapture,
    };
}

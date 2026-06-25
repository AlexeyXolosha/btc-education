<template>
  <div
      class="slider"
      :class="{ 'is-column': column }"
      :data-sw="uid"
      @mouseenter="onHoverPause"
      @mouseleave="onHoverResume"
  >
    <div
        class="slider-viewport"
        :style="{ height: column && viewSize ? `${viewSize}px` : null }"
    >
      <div
          class="slider-wrapper"
          ref="wrapper"
          :class="{ 'is-dragging': isDragging }"
          :style="{ transform: column ? `translateY(${translate}px)` : `translateX(${translate}px)` }"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onUp"
          @click.capture="onClickCapture"
      >
        <div class="slider-item" v-for="(item, index) in items" :key="index">
          <slot name="slide" :item="item" :index="index"/>
        </div>
      </div>
    </div>

    <ul v-if="pagination && mounted" class="slider-pagination">
      <li v-for="i in bullets" :key="i" class="slider-pagination-item">
        <button
            type="button"
            class="slider-pagination-button"
            :class="{ active: isActive(i) }"
            :aria-label="`Перейти к слайду ${i + 1}`"
            :aria-current="isActive(i) ? 'true' : undefined"
            @click="onSelect(i)"
        />
      </li>
    </ul>

    <template v-if="hasNavigation">
      <button :disabled="!canPrev" @click="handlePrevClick" class="slider-navigation prev">
        <i class="fa-regular fa-chevron-left"></i>
      </button>
      <button :disabled="!canNext" @click="handleNextClick" class="slider-navigation next">
        <i class="fa-regular fa-chevron-right"></i>
      </button>
    </template>
  </div>
</template>

<script setup>
import {useSliderCore} from "~/composables/slider/useSliderCore.js";
import {useDrag} from "~/composables/slider/useDrag.js";
import {useAutoplay} from "~/composables/slider/useAutoplay.js";
import {useReducedMotion} from "~/composables/slider/useReducedMotion.js";
import {usePagination} from "~/composables/slider/usePagination.js";
import {useNavigation} from "~/composables/slider/useNavigation.js";
import {useBreakpoints} from "~/composables/slider/useBreakpoints.js";

const props = defineProps({
  items: {type: Array, default: () => []},
  slidesPerView: {type: [Number, String], default: 1},
  breakpoints: {type: Object, default: () => ({})},
  gap: {type: Number, default: 16},
  column: {type: Boolean, default: false},
  autoplay: {type: [Boolean, Object], default: false},
  pagination: {type: Boolean, default: true},
  modelValue: {type: Number, default: 0},
  navigation: {type: [Boolean, Object], default: true},
})

const emit = defineEmits(['update:modelValue', 'slide-change']);
const mounted = ref(false)
const wrapper = ref(null);

const reducedMotion = useReducedMotion();

const hasNavigation = computed(() => props.navigation !== false);
const isScrollOnly = computed(() => {
  if (typeof props.navigation === 'object' && props.navigation !== null) {
    return !!props.navigation.scrollOnly;
  }
  return false;
});

const {
  translate, currentIndex, viewIndex, isDragging, slideStep, maxTranslate, maxIndex, viewSize,
  goTo, scrollTo, next, prev, scrollNext, scrollPrev
} = useSliderCore(wrapper, props, emit)

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
  mounted.value = true
})

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
</script>

<style lang="scss" scoped>
.slider {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &.is-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    height: auto;
    align-self: flex-start;

    .slider-viewport {
      order: 2;
      flex: 0 0 auto;
      width: 100%;
      min-height: 0;
    }

    .slider-wrapper {
      flex-direction: column;
      height: auto;
      touch-action: pan-x;
    }

    .slider-item {
      flex: 0 0 auto;
      width: 100%;
    }

    .slider-navigation {
      position: relative;
      top: auto;
      left: auto;
      right: auto;
      transform: none;
      width: 100%;
      flex: 0 0 auto;
      z-index: 2;

      i {
        transform: rotate(90deg);
      }

      &.prev {
        order: 1;
      }

      &.next {
        order: 3;
      }
    }
  }

  &-viewport {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &-wrapper {
    width: 100%;
    display: flex;
    gap: var(--sw-gap, 16px);
    cursor: grab;
    touch-action: pan-y;
    will-change: transform;
    transition: transform 0.4s ease;

    &.is-dragging {
      transition: none;
      cursor: grabbing;
      user-select: none;
    }
  }

  &-item {
    flex: 0 0 calc((100% - (var(--spv) - 1) * var(--sw-gap, 16px)) / var(--spv));
    border-radius: var(--sw-item-radius, 0);
    overflow: var(--sw-item-overflow, visible);
  }

  &-pagination {
    position: absolute;
    bottom: var(--sw-pg-bottom, 48px);
    left: var(--sw-pg-left, 72px);
    z-index: 10;

    display: flex;
    align-items: center;
    gap: var(--sw-pg-gap, 4px);

    &-item {

      button {
        display: flex;
        align-items: center;

        width: var(--sw-bullet-size, 4px);
        height: var(--sw-bullet-size, 4px);
        background-color: var(--sw-bullet-color, #{rgba($blue, 0.5)});
        border-radius: 50%;

        &.active {
          width: var(--sw-bullet-active-width, 16px);
          border-radius: 4px;
          background-color: var(--sw-bullet-active-color, #{$blue});
        }
      }
    }
  }

  &-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--sw-nav-width, var(--sw-nav-size, 40px));
    height: var(--sw-nav-height, var(--sw-nav-size, 40px));

    position: absolute;
    top: calc(50%);
    transform: translateY(-50%);

    background-color: var(--sw-nav-bg, #{$white});
    border: var(--sw-border-nav, none);
    border-radius: var(--sw-nav-radius, 4px);

    transition: all 0.3s ease;

    i {
      font-size: var(--sw-i-size, 18px);
      font-weight: 600;
      color: var(--sw-nav-icon, #{$blue});
    }

    &.prev {
      left: var(--sw-nav-offset, 12px);
      margin-bottom: var(--sw-nav-margin, 0);
    }

    &.next {
      right: var(--sw-nav-offset, 12px);
      margin-top: var(--sw-nav-margin, 0);
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
      pointer-events: none;
    }
  }

  img {
    pointer-events: none;
  }
}
</style>
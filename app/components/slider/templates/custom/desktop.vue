<template>
  <div
      class="slider"
      :data-sw="uid"
      @mouseenter="onHoverPause"
      @mouseleave="onHoverResume"
  >
    <div
        class="slider-wrapper"
        ref="wrapper"
        :class="{ 'is-dragging': isDragging }"
        :style="{ transform: `translateX(${translate}px)` }"
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
    <template v-if="navigation">
      <button :disabled="!canPrev" @click="onPrev" class="slider-navigation prev">
        <i class="fa-regular fa-chevron-left"></i>
      </button>
      <button :disabled="!canNext" @click="onNext" class="slider-navigation next">
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
  breakpoints: { type: Object, default: () => ({}) },
  gap: {type: Number, default: 16},
  autoplay: {type: [Boolean, Object], default: false},
  pagination: {type: Boolean, default: true},
  navigation: {type: Boolean, default: true},
})

const emit = defineEmits(['update:modelValue', 'slide-change']);
const mounted = ref(false)
const wrapper = ref(null);

const reducedMotion = useReducedMotion();

const {translate, currentIndex, isDragging, slideStep, maxIndex, goTo, next, prev} =
    useSliderCore(wrapper, props, emit)

const { uid, css } = useBreakpoints(props);
useHead({ style: [{ innerHTML: css }] });

const {start: startAutoplay, stop: stopAutoplay, reset: resetAutoplay, onHoverPause, onHoverResume} = useAutoplay(
    computed(() => props.autoplay),
    {currentIndex, maxIndex, next, goTo, reducedMotion}
);

const {onDown, onMove, onUp, onClickCapture} = useDrag({
  wrapper,
  translate,
  isDragging,
  slideStep,
  onStart: stopAutoplay,
  onSettle: (index) => {
    goTo(index);
    startAutoplay();
  },
});

onMounted(() => {
  mounted.value = true
})
const {bullets, isActive, select} = usePagination({currentIndex, maxIndex, goTo});
const {canPrev, canNext} = useNavigation({currentIndex, maxIndex, prev, next})

const onNext = () => {
  next();
  resetAutoplay();
};
const onPrev = () => {
  prev();
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
  }

  &-pagination {
    position: absolute;
    bottom: 48px;
    left: 72px;
    z-index: 10;

    display: flex;
    align-items: center;
    gap: 4px;

    &-item {

      button {
        display: flex;
        align-items: center;

        width: 4px;
        height: 4px;
        background-color: rgba($blue, 0.5);
        border-radius: 50%;

        &.active {
          width: 16px;
          border-radius: 4px;
          background-color: $blue;
        }
      }
    }
  }

  &-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;

    position: absolute;
    top: calc(50%);
    transform: translateY(-50%);

    background-color: #FFF;
    border: none;
    border-radius: 4px;

    transition: opacity 0.2s, background 0.2s;

    i {
      font-size: 18px;
      font-weight: 600;
      color: $blue;
    }

    &.prev {
      left: 12px;
    }

    &.next {
      right: 12px;
    }

    &:disabled {
      opacity: 0.8;
      cursor: default;
      pointer-events: none;
    }
  }
}
</style>

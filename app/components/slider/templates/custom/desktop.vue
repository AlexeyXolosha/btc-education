<template>
  <div
    :class="'sw-' + uid"
    class="slider"
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
        <slot name="slide" :item="item" :index="index" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSliderCore } from "~/composables/slider/useSliderCore.js";
import { useDrag } from "~/composables/slider/useDrag.js";
import { useResponsiveCss } from "~/composables/slider/useResponsiveCss.js";
import { useAutoplay } from "~/composables/slider/useAutoplay.js";
import { useReducedMotion } from "~/composables/slider/useReducedMotion.js";

const props = defineProps({
  items: { type: Array, default: () => [] },
  slidesPerView: { type: [Number, String], default: 2 },
  gap: { type: Number, default: 16 },
  breakpoints: { type: Object, default: () => ({}) },
  autoplay: { type: [Boolean, Object], default: false },
})

const emit = defineEmits(['update:modelValue', 'slide-change']);

const wrapper = ref(null);
const reducedMotion = useReducedMotion();

const { translate, currentIndex, isDragging, slideStep, maxIndex, goTo, next } =
  useSliderCore(wrapper, props, emit);

const { onDown, onMove, onUp, onClickCapture } = useDrag({
  wrapper,
  translate,
  isDragging,
  slideStep,
  onSettle: goTo,
});

const { uid, responsiveCss } = useResponsiveCss(props);

const { onHoverPause, onHoverResume } = useAutoplay(
  computed(() => props.autoplay),
  { currentIndex, maxIndex, next, goTo, reducedMotion }
);

useHead({ style: [{ innerHTML: responsiveCss }] });
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
}
</style>

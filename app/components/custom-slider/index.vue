<template>
  <div
      class="slider"
      :class="{ 'is-column': column, 'is-reduced': reducedMotion }"
      :data-sw="uid"
      @mouseenter="onHoverPause"
      @mouseleave="onHoverResume"
  >
    <div class="slider-viewport">
      <div
          class="slider-wrapper"
          ref="wrapper"
          :class="{ 'is-dragging': isDragging }"
          :style="{ transform: column ? `translateY(${translate}px)` : `translateX(${translate}px)` }"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onUp"
          @dragstart.prevent
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
      <button
          v-if="column || canPrev"
          :disabled="!canPrev"
          @click="handlePrevClick"
          class="slider-navigation prev"
      >
        <i class="fa-regular fa-chevron-left"></i>
      </button>
      <button
          v-if="column || canNext"
          :disabled="!canNext"
          @click="handleNextClick"
          class="slider-navigation next"
      >
        <i class="fa-regular fa-chevron-right"></i>
      </button>
    </template>
  </div>
</template>

<script setup>
import {useSlider} from "~/composables/slider/useSlider.js";

const props = defineProps({
  items: {type: Array, default: () => []},
  slidesPerView: {type: [Number, String], default: 1},
  breakpoints: {type: Object, default: () => ({})},
  gap: {type: Number, default: 16},
  column: {type: Boolean, default: false},
  autoplay: {type: [Boolean, Object], default: false},
  pagination: {type: Boolean, default: false},
  modelValue: {type: Number, default: 0},
  navigation: {type: [Boolean, Object], default: false},
})

const emit = defineEmits(['update:modelValue', 'slide-change']);

const {
  wrapper, uid, reducedMotion, translate, isDragging,
  mounted, bullets, isActive, onSelect,
  hasNavigation, canPrev, canNext, handlePrevClick, handleNextClick,
  onHoverPause, onHoverResume, onDown, onMove, onUp, onClickCapture,
} = useSlider(props, emit);
</script>

<style lang="scss" scoped></style>
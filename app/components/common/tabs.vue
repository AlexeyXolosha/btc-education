<template>
  <nav class="tabs">
    <ul class="tabs__list">
      <li
          v-for="item in data?.data"
          :key="item?.id"
          @click="fetchProduct(item)"
          :class="{ 'is-active': item?.id === activeCategory }"
          class="tabs__item"
      >
        {{ item?.attributes?.name }}
      </li>
    </ul>
  </nav>
</template>

<script setup>
import {categoryCompose} from "~/composables/compose/category.compose.js";

const props = defineProps(["data"]);
const sliderCacheKey = inject('sliderCacheKey');
const productKey = `${sliderCacheKey}:product`;

const { activeCategory, fetchProduct } = categoryCompose(productKey);
</script>
<style lang="scss" scoped>
.tabs {
  &__list {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  &__item {
    @include flex-center;

    border: 1px solid rgba($blue, 0.4);
    border-radius: 6px;
    padding-inline: 16px;
    cursor: pointer;

    font-size: 14px;
    line-height: 24px;

    &.is-active {
      border-color: $blue;
    }
  }
}
</style>
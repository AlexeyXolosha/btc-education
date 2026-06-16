<template>
  <nav class="tabs">
    <ul class="tabs__list">
      <li @click="fetchProduct(item?.links?.self)" :class="{ 'is-active': item?.id === activeId }" class="tabs__item" v-for="item in data?.data" :key="item?.id">
        {{ item?.attributes?.name }}

      </li>
    </ul>
  </nav>
</template>

<script setup>
import {useFetchClient} from "~/composables/fetch/useFetchClient.js";

const props = defineProps(["data"]);
const { execute } = await useFetchClient(props?.data?.data?.[0]?.links?.self, { method: "GET", lazy: true }, "product");
const fetchProduct = (url) => execute(url, true);
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
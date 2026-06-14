<template>
  <ul class="header-links">
    <li class="header-link" v-for="item in data?.data.slice(0, 12)" :key="item?.id">
      <NuxtLink :to="item?.links?.self">
        {{ item?.attributes?.name }}
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
import {useCachedData} from "~/composables/fetch/useCashedData.js";

const {data, loading, error} = useCachedData("header-popular");
</script>

<style lang="scss" scoped>
.header-links {
  display: flex;
  align-items: center;
  gap: 50px;
}

.header-link {
  a {
    color: $dark-ultra-blue;
    transition-duration: $transition-duration;

    @include hover {
      color: $dark-blue;
    }
  }
}
</style>
<template>
  <section class="section products">
    <div class="container">

      <div class="products__head flex column gap--16">
        <h2 class="title-h2">{{ data?.meta?.title }}</h2>
        <common-tabs :data="data"></common-tabs>
      </div>

    </div>
  </section>
</template>

<script setup>
import {useCachedData} from "~/composables/fetch/useCashedData.js";

const cacheKey = inject('sliderCacheKey');
const {data, loading, error} = useCachedData(cacheKey);
</script>

<style lang="scss" scoped>

</style>
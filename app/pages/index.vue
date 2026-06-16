<template>
  <NuxtLayout name="hero">

    <slider-component/>
    <product-slider-component :service="HERO_CONTENT.PRODUCT_HITS"/>

  </NuxtLayout>
</template>

<script setup>
import HERO_CONTENT from "~/services/index/index.js"

await HERO_CONTENT.GET_HERO_SLIDER()
</script>

<style lang="scss" scoped>

</style>
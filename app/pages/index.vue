<template>
  <NuxtLayout name="hero">

    <slider-component template="custom"></slider-component>
<!--    <slider-component/>-->
    <product-slider-component :service="HERO_CONTENT.PRODUCT_HITS"/>
    <product-slider-component :service="HERO_CONTENT.PRODUCT_STOCK"/>
    <product-slider-component :service="HERO_CONTENT.PRODUCT_RECOMMENDATIONS"/>

  </NuxtLayout>
</template>

<script setup>
import HERO_CONTENT from "~/services/index/index.js"

await HERO_CONTENT.GET_HERO_SLIDER()
</script>

<style lang="scss" scoped>

</style>
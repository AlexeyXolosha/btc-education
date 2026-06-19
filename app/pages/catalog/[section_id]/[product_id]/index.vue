<template>
  <NuxtLayout name="hero">
    <product-detail-component/>
  </NuxtLayout>
</template>

<script setup>
import {useFetchHook} from "~/composables/fetch/useFetchHook.js";
import {ProductDetailDTO} from "~/models/product/index.js";

const route = useRoute();

useFetchHook(route?.fullPath, {method: "GET"}, "DETAIL_PAGE", null, (raw) => ProductDetailDTO({...raw.data, meta: raw.meta}))
</script>

<style lang="scss" scoped>

</style>
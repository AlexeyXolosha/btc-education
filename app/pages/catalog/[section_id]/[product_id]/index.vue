<template>
  <NuxtLayout name="hero">
    <product-detail-component />
  </NuxtLayout>
</template>

<script setup>
import {useFetchHook} from "~/composables/fetch/useFetchHook.js";

const route = useRoute();

await useFetchHook(route?.fullPath, {method: "GET"}, "DETAIL_PAGE")
</script>

<style lang="scss" scoped>

</style>
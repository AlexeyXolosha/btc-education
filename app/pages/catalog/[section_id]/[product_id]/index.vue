<template>
  <NuxtLayout name="hero">
  Product
  </NuxtLayout>
</template>

<script setup>
import {useFetchHook} from "~/composables/fetch/useFetchHook.js";

const route = useRoute();

const {data} = await useFetchHook(route?.fullPath, {method: "GET"}, "DETAIL_PAGE")
</script>

<style lang="scss" scoped>

</style>
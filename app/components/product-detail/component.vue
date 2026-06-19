<template>
  <component :is="currentComponent"></component>
</template>

<script setup>
import {useLoaderComponent} from "~/composables/useLoaderComponent.js";
import {useCachedData} from "~/composables/fetch/useCashedData.js";

const props = defineProps(['template'])
const {currentComponent} = useLoaderComponent('product-detail', props.template);

const {data, loading, error} = useCachedData("DETAIL_PAGE")
provide("useParent", {data, loading, error})
</script>

<style lang="scss" scoped>

</style>
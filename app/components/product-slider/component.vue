<template>
  <component :is="currentComponent"></component>
</template>

<script setup>
import {useLoaderComponent} from "~/composables/useLoaderComponent.js";

const props = defineProps(['template', 'service'])
const {currentComponent} = useLoaderComponent('product-slider', props.template);

provide('sliderCacheKey', props.service.key);

await props.service.fetch();
</script>

<style lang="scss" scoped>

</style>
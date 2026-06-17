<template>
  <component :is="currentComponent"></component>
</template>

<script setup>
import {useLoaderComponent} from "~/composables/useLoaderComponent.js";
import {useFetchHook} from "~/composables/fetch/useFetchHook.js";

const props = defineProps(['template'])
const {currentComponent} = useLoaderComponent('header', props.template);

await useFetchHook('/include/menu/main/', {method: 'GET'}, 'header-popular')
</script>

<style lang="scss" scoped>

</style>
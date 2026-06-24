<template>
  <component :is="currentComponent"></component>
</template>

<script setup>
import {useLoaderComponent} from "~/composables/useLoaderComponent.js";

const config = useRuntimeConfig()
const apiURL = config.public.BASE_URL;

const props = defineProps(['template'])
const {currentComponent} = useLoaderComponent('hero', props.template);

provide("useParent", {apiURL})
</script>

<style lang="scss" scoped>

</style>
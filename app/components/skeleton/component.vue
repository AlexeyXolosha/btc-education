<template>
  <component :is="currentComponent"></component>
</template>

<script setup>
import {useLoaderComponent} from "~/composables/useLoaderComponent.js";

const props = defineProps(['template'])
const {currentComponent} = useLoaderComponent('skeleton', props.template);
</script>

<style lang="scss" scoped>

</style>
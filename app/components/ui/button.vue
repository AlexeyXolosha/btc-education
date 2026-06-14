<template>
  <NuxtLink v-if="link" :to="link" :target="target" class="button" :class="{'is-disabled': disabled}"
            @click="disabled && $event.preventDefault()">
    <slot></slot>
  </NuxtLink>

  <button v-else :type="type" :disabled="disabled" class="button">
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  link: {type: String, default: null},
  href: {type: String, default: null},
  target: {type: String, default: '_self'},

  type: {type: String, default: 'button'},
  disabled: {type: Boolean, default: false}
})
</script>

<style lang="scss" scoped>
.button {
  @include inline-flex-center;

  border: none;
  background-color: $yellow;
  border-radius: $border-radius;

  padding: 0 20px;

  width: 100%;
  height: 48px;

  transition-duration: $transition-duration;

  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  @include hover {
    background-color: $dark-yellow;
  }
}
</style>
<template>
  <div class="characteristics">
    <h3 class="characteristics-title">Характеристики:</h3>

    <ul class="characteristics-list">
      <li class="characteristics-item" v-for="(property, objectKey) in items" :key="objectKey">
        <p class="characteristics-item__name">{{ property.name }}</p>
        <p class="characteristics-item__value">{{ property.value }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps(["items"])
</script>

<style lang="scss" scoped>
.characteristics {
  min-width: 383px;

  &-title {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    margin-bottom: 16px;
  }

  &-list {
    display: flex;
    flex-direction: column;
  }

  &-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;

    position: relative;

    &__name {
      color: $black-80;
      line-height: 28px;
      background-color: $white;

      display: flex;
      align-items: baseline;
      flex-grow: 1;

      &::after {
        content: "";
        flex-grow: 1;
        border-bottom: 1px dashed $black-40;
        margin: 0 12px;
      }
    }

    &__value {
      background-color: $white;
      line-height: 28px;
    }

  }
}
</style>
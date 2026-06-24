<template>
  <div class="content-detail">
    <div class="content-detail__top">

      <slider-component
          class="main-slider"
          :items="data?.images"
          :slides-per-view="1"
          :gap="24"
          :navigation="false"
          :autoplay="{ delay: 6000, pauseOnHover: false }"
          :pagination="false"
          template="custom"
      >
        <template #slide="{ item }">
          <div class="main-slider__image">
            <img :src="apiURL + item.src" :alt="item.alt" @dragstart.prevent>
          </div>
        </template>
      </slider-component>

      <div class="characteristics">
        <h3 class="characteristics-title">Характеристики:</h3>

        <ul class="characteristics-list">
          <li class="characteristics-item" v-for="(property, objectKey) in data.properties" :key="objectKey">
            <p class="characteristics-item__name">{{ property.name }}</p>
            <p class="characteristics-item__value">{{ property.value }}</p>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script setup>
const {data, apiURL} = inject("useParent");
</script>

<style lang="scss" scoped>
.content-detail__top {
  display: flex;
  gap: 68px;
}

.main-slider__image {
  height: 480px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
<template>
  <section class="section products">
    <div class="container">

      <div class="products__head flex column gap--16">
        <h2 class="title-h2">{{ categories?.meta?.title }}</h2>
        <common-tabs :data="categories"></common-tabs>
      </div>

      <CustomSlider :slides-per-view="6"
                    :gap="24"
                    :items="products?.data">
        <template #slide="{ item, index }">
          <product-card-component :data="item"></product-card-component>
        </template>
      </CustomSlider>

    </div>
  </section>
</template>

<script setup>
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';

import {useCachedData} from "~/composables/fetch/useCashedData.js";
import {categoryCompose} from "~/composables/compose/category.compose.js";

const cacheKey = inject('sliderCacheKey');
const productKey = `${cacheKey}:product`;

const {data: categories} = useCachedData(cacheKey);
const {data: products, loading, fetchInitial} = categoryCompose(productKey);

const firstCategory = categories.value?.data?.[0];

if (firstCategory && !products.value) {
  await fetchInitial(firstCategory.links.self, firstCategory.id);
}
</script>

<style lang="scss" scoped>
.products {
  &__head {
    margin-bottom: 40px;
  }

  &__slide {
    height: auto;
  }
}
</style>
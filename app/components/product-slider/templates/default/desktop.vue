<template>
  <section class="section products">
    <div class="container">

      <div class="products__head flex column gap--16">
        <h2 class="title-h2">{{ categories?.meta?.title }}</h2>
        <common-tabs :data="categories"></common-tabs>
      </div>

      <div class="products__swiper">
        <ClientOnly>
          <Swiper :slides-per-view="6" :space-between="24">
            <SwiperSlide class="products__slide" v-for="item in products?.data" :key="item?.id">
              <product-card-component :data="item"></product-card-component>
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </div>

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
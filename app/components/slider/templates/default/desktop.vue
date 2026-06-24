<template>
  <section class="section hero">

    <div class="hero-inner container">

      <ClientOnly>
        <Swiper
            class="hero-swiper"
            :slides-per-view="1"
            :space-between="24"
            :pagination="{ clickable: true }"
            :modules="modules"
        >
          <SwiperSlide v-for="item in slides" :key="item.id" class="hero-slide__content">

            <div class="hero-slide__image">
              <img :src="apiURL + item.imageDesktop" alt="">
            </div>

            <div class="hero-slide__info">
              <h2 class="hero-slide__title">{{ item.title }}</h2>
              <div class="hero-slide__text">{{ item.description }}</div>
            </div>

          </SwiperSlide>
        </Swiper>
      </ClientOnly>

      <div class="hero-footer">
      </div>
    </div>

  </section>
</template>

<script setup>
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import {useCachedData} from "~/composables/fetch/useCashedData.js";

const {apiURL} = inject("useParent");
const {data, loading, error} = useCachedData("slider-hero");

const slides = computed(() => data.value?.data?.slice(0, 3) ?? []);

const modules = [Pagination];
</script>

<style lang="scss" scoped>
.hero {
  background-color: $background-blue;
  padding-block: 50px;

  &-swiper {
    height: 320px;
    margin-bottom: 30px;
  }

  &-slide {
    &__content {
      position: relative;
      height: 100%;
      overflow: hidden;
      border-radius: $border-radius;

      &::before {
        content: "";
        position: absolute;
        background-color: $dark-yellow;

        display: block;
        transform: skew(-14deg);

        width: 150%;
        height: 150%;
        z-index: 1;
        top: -25%;
        left: -100%;
      }
    }

    &__image {
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__info {
      position: absolute;
      left: 72px;
      top: 72px;
      z-index: 1;
    }

    &__title {
      font-size: 40px;
      font-weight: 400;
      line-height: 44px;
      max-width: 552px;
      margin-bottom: 36px;
    }

    &__text {
      font-size: 18px;
      font-weight: 400;
      line-height: 32px;
      color: $dark-blue;
    }
  }
}
</style>

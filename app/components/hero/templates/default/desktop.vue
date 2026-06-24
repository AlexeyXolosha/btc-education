<template>
  <section class="hero">
    <div class="container">
      <slider-component style="margin-bottom: 32px" :items="data?.data" :slides-per-view="1" :gap="24" template="custom" :navigation="false"
                        :autoplay="{ delay: 6000, pauseOnHover: false }" >
        <template #slide="{ item }">
          <div class="slider-item__content">
            <div class="image">
              <img :src="apiURL + item.imageDesktop" alt="" @dragstart.prevent>
            </div>
            <div class="content">
              <h2 class="content-title">{{ item?.name }}</h2>
              <div class="content-text">{{ item?.description }}</div>
            </div>
          </div>
        </template>
      </slider-component>

      <cards-component template="hero-advantages"/>
    </div>
  </section>
</template>

<script setup>
import {useCachedData} from "~/composables/fetch/useCashedData.js";

const {apiURL} = inject("useParent");
const {data, loading, error} = useCachedData("slider-hero");
</script>

<style lang="scss" scoped>
.hero {
  background: #F1F6FD;
  padding-block: 50px;
}

.slider-item__content {
  position: relative;
  height: 310px;
  overflow: hidden;
  border-radius: $border-radius;

  .image {
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .content {
    position: absolute;
    left: 72px;
    top: 72px;
    z-index: 10;

    &-title {
      font-size: 40px;
      font-weight: 400;
      line-height: 44px;
      max-width: 552px;
      margin-bottom: 36px;
    }

    &-text {
      font-size: 18px;
      font-weight: 400;
      line-height: 32px;
      color: $dark-blue;
    }
  }

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
</style>
<template>
  <div class="product">

    <!--  [ Top ]  -->
    <div class="product-stikers">
      <div class="product-stikers__item" v-for="(item, index) in data?.stikers" :key="index"
           :style="getStickerStyles(item)">
        {{ item }}
      </div>
    </div>
    <NuxtLink :to="data?.links?.self" class="product-image">
      <img :src="apiURL + data?.image" alt="">
    </NuxtLink>

    <!--  [CENTER]  -->
    <div class="product-info">
      <div class="product-rating">
        <i v-if="data?.reviewsStatics?.rating" class="fa-solid fa-star"></i>
        <span>{{ data?.reviewsStatics?.rating }}</span>
      </div>
      <NuxtLink :to="data?.links?.self" class="product-name">{{ data?.name }}</NuxtLink>
      <p class="product-count">В наличии в
        <NuxtLink :to="data?.links?.self">{{ data?.inStockCount }} магазине</NuxtLink>
      </p>

      <div class="product-price">
        <div class="old-price"></div>
        <div class="price">{{ data?.priceValue }}</div>
      </div>
    </div>

    <div class="product-actions">
      <ui-button class="product-add-cart gap--8">
        <i class="fa-regular fa-plus"></i>
        <span>В корзину</span>
      </ui-button>
      <div class="product-actions__wishlist">
        <button class="button">
          <i class="fa-regular fa-heart"></i>
        </button>
        <button class="button">
          <i class="fa-regular fa-layer-plus"></i>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import {getStickerStyles} from "~/composables/product/getStickerStyles.js";

const props = defineProps(['data']);
const {apiURL} = inject("useParent")
</script>

<style src="./sass/style.scss" lang="scss" scoped></style>
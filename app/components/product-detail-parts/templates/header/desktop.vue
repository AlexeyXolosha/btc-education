<template>
  <header class="header-detail">
    <div class="header-detail__inner">

      <nav class="header-detail__breadcrumbs breadcrumbs">
        <ul class="breadcrumbs__list">
          <li class="breadcrumbs__item" v-for="(item, index) in data?.breadcrumbs" :key="index">
            <nuxt-link :to="item?.links?.self">{{ item?.attributes?.name }}</nuxt-link>
            <span v-if="index < data.breadcrumbs.length - 1"> /</span>
          </li>
        </ul>
      </nav>

      <div class="header-detail__info">
        <div class="header-detail__info-top">
          <div class="header-detail__info-text">
            <h1 class="header-detail__title">{{ data?.name }}</h1>
            <ul class="header-detail__stikers">
              <li class="header-detail__stiker stiker" v-for="(item, index) in data?.stikers?.value" :key="index"
                  :style="getStickerStyles(item)">
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="header-detail__brand">
            <img :src="useApiUrl(data?.brandImage)" :alt="data?.brand?.name">
          </div>
        </div>
      </div>

      <div class="header-detail__actions">
        <div class="header-detail__rating" v-if="data?.rating">
          <i class="fa-solid fa-star"></i>
          <p class="header-detail__rating-value">4,6</p>
        </div>
        <div class="header-detail__article" v-if="data?.article">
          <p class="header-detail__article-text">Код товара: <span>{{ data?.article }}</span></p>

        </div>
        <button class="header-detail__action">
          <i class="fa-regular fa-layer-plus"></i>
          <span>Сравнить</span>
        </button>
        <button class="header-detail__action">
          <i class="fa-regular fa-heart"></i>
          <span>Избранное</span>
        </button>
        <button class="header-detail__action">
          <i class="fa-regular fa-share-nodes"></i>
          <span>Поделиться</span>
        </button>
      </div>


    </div>
  </header>
</template>

<script setup>
import {getStickerStyles} from "~/composables/product/getStickerStyles.js";
import {useApiUrl} from "~/composables/helpers/useApiUrl.js";

const {data} = inject("useParent");
</script>

<style lang="scss" scoped>
.header-detail {
  margin-bottom: 68px;
  .breadcrumbs {
    margin-bottom: 20px;

    &__list {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 4px;
      transition-duration: $transition-duration;
      color: $black-70;

      a {
        font-size: 14px;
        font-weight: 400;
        line-height: 42px;
        color: inherit;
      }

      &:last-child {
        color: $black;
      }

      @include hover {
        color: $black;
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;

    &-top {
      display: flex;
      align-items: center;
      gap: 24px;
      justify-content: space-between;
    }

    &-text {
      display: flex;
      align-items: center;
      gap: 20px;
    }
  }

  &__title {
    font-size: 30px;
    line-height: 40px;
  }

  &__stikers {
    display: flex;
    gap: 8px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 5px;

    i {
      color: $dark-yellow;
    }
  }

  &__article {
    &-text {
      color: $black-80;

      span {
        color: $black;
      }
    }
  }

  &__action {
    display: flex;
    align-items: center;
    gap: 12px;

    i {
      font-size: 16px;
      font-weight: 400;
      line-height: 100%;
      color: $blue;
    }

    span {
      font-size: 14px;
      line-height: 24px;
    }
  }
}
</style>
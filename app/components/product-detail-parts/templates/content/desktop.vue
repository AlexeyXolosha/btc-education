<template>
  <div class="content-detail">
    <div class="left">
      <div class="content-detail__top">

        <custom-slider
            class="miniature-slide"
            v-model="activeIndex"
            :items="data?.images"
            :slides-per-view="5"
            :column="true"
            :gap="8"
            :navigation="{ scrollOnly: true }"
            :pagination="false"
        >
          <template #slide="{ item, index }">
            <div
                class="miniature-slide__item"
                :class="{ 'is-active': index === activeIndex }"
                @click="activeIndex = index"
            >
              <img :src="apiURL + item.src" :alt="item.alt" @dragstart.prevent>
            </div>
          </template>
        </custom-slider>

        <div class="content-detail__top-main">
          <custom-slider
              class="main-slider"
              v-model="activeIndex"
              :items="data?.images"
              :slides-per-view="1"
              :gap="24"
              :navigation="false"
              :pagination="false"
          >
            <template #slide="{ item, index }">
              <div
                  class="main-slider__image"
                  :class="{ 'is-active': index === activeIndex }"
                  @click="activeIndex = index"
              >
                <img :src="apiURL + item.src" :alt="item.alt" @dragstart.prevent>
              </div>
            </template>
          </custom-slider>

          <common-characteristics :items="data?.properties"/>
        </div>
      </div>
    </div>
    <div class="right"></div>
  </div>
</template>

<script setup>
const {data, apiURL} = inject("useParent");
const activeIndex = ref(0);
</script>

<style lang="scss" scoped>
.content-detail {
  display: flex;
  gap: 68px;

  .left {
    max-width: 1200px;
    width: 100%;
  }

  &__top {
    display: flex;

    &-main {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  }

  .main-slider {
    max-width: 552px;
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

  .miniature-slide {
    --sw-item-h: 76px;
    --sw-nav-width: 100%;
    --sw-nav-height: 32px;
    --sw-border-nav: 2px solid rgba(14, 108, 221, 0.20);
    --sw-nav-radius: 6px;
    --sw-nav-margin: 8px;
    --sw-i-size: 14px;
    margin-right: 68px;

    width: 76px;
    flex: 0 0 76px;

    &__item {
      height: 76px;
      flex: 0 0 76px;

      border: 2px solid transparent;
      border-radius: 6px;
      padding: 6px;
      cursor: pointer;
      transition: all 0.3s ease;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &.is-active {
        opacity: 1;
        border-color: #0E6CDD;
      }

      @include hover {
        border-color: #0E6CDD;
      }
    }
  }


}
</style>
<template>
  <ul class="advantages-list">
    <li class="advantages-item flex ai-center gap--16" v-for="item in data?.data" :key="item?.id">
      <div class="advantages-item__image">
        <img :src="apiURL + item?.attributes?.image" :alt="item?.attributes?.name">
      </div>
      <p class="advantages-item__title" v-html="item?.attributes?.text "></p>
    </li>
  </ul>
</template>

<script setup>
import HERO_CONTENT from "~/services/index/index.js";
import {useCachedData} from "~/composables/fetch/useCashedData.js";

await HERO_CONTENT.GET_HERO_ADVANTAGES();

const {data, loading} = useCachedData("advantages-hero");
const {apiURL} = inject("useParent");
</script>

<style lang="scss" scoped>
.advantages-list {
  display: flex;
  gap: 32px;
  justify-content: space-between;
}

.advantages-item {
  background-color: $white;
  border-radius: 6px;

  width: 100%;

  padding: 20px 28px;

  &__image {
    width: 26px;
    height: 26px;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__title {
    line-height: 18px;
    @include line-limit(2);
    max-width: 192px;
  }

}
</style>
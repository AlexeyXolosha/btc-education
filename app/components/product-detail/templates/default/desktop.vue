<template>
  <section class="product-detail">

    <div class="container">
      <!-- [Шапка Страницы]   -->
      <product-detail-parts-component template="header"/>

      <!-- [Контент]   -->
      <product-detail-parts-component template="content"/>
    </div>

  </section>
</template>

<script setup>
const {loading, error} = inject("useParent");
</script>

<style lang="scss" scoped>

</style>
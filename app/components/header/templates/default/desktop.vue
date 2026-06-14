<template>
  <header class="header">
    <div class="header-inner">
      <div class="header-top flex ai-center jc-between">

        <div class="header-left flex ai-center gap--25">
          <ui-logo></ui-logo>
          <ui-button class="header-button gap--10">
            <i class="fa-solid fa-bars"></i>
            <span>Каталог</span>
          </ui-button>
        </div>

        <common-header-parts-search class="header-search-wrapper"/>

        <common-header-parts-actions />
      </div>
      <div class="header-bottom">
        <common-header-parts-links/>
      </div>
    </div>
  </header>
</template>

<script setup>

</script>

<style src="./sass/desktop.scss" lang="scss" scoped>

</style>
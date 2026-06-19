<template>
  <div class="skeleton-header">

    <div class="skeleton-breadcrumbs"></div>
    <div class="skeleton-info">
      <div class="skeleton-title"></div>
      <div class="skeleton-brand"></div>
    </div>
    <div class="skeleton-actions">
      <div class="skeleton-actions-item"></div>
      <div class="skeleton-actions-item"></div>
      <div class="skeleton-actions-item"></div>
      <div class="skeleton-actions-item"></div>
      <div class="skeleton-actions-item"></div>
    </div>

  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.skeleton-header {
  .skeleton-breadcrumbs {
    width: 800px;
    height: 24px;
    @include skeleton;
    margin-bottom: 20px;
  }

  .skeleton-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    margin-bottom: 16px;

    .skeleton-title {
      width: 600px;
      height: 40px;
      @include skeleton;
    }

    .skeleton-brand {
      width: 150px;
      height: 40px;
      @include skeleton;
    }
  }

  .skeleton-actions {
    display: flex;
    align-items: center;
    gap: 16px;

    .skeleton-actions-item {
      width: 120px;
      height: 24px;
      @include skeleton;
    }
  }
}
</style>
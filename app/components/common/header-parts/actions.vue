<template>
  <ul class="header-actions">
    <li class="header-action">
      <NuxtLink>
        <i class="fa-regular fa-heart"></i>
        <span>Избранное</span>
      </NuxtLink>
    </li>
    <li class="header-action">
      <NuxtLink>
        <i class="fa-regular fa-layer-plus"></i>
        <span>Избранное</span>
      </NuxtLink>
    </li>
    <li class="header-action">
      <NuxtLink>
        <i class="fa-regular fa-cart-shopping"></i>
        <span>0</span>
      </NuxtLink>
    </li>
    <li class="header-action">
      <NuxtLink>
        <i class="fa-regular fa-user-circle"></i>
        <span>Войти</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 32px;
}

.header-action {
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    cursor: pointer;

    span {
      font-size: 14px;
      font-weight: 400;
      color: #333;
    }

    i {
      font-size: 24px;
      font-weight: 400;
      color: $blue;
    }
  }
}
</style>
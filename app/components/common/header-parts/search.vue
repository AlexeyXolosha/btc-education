<template>
  <div class="header-search">
    <input type="text" placeholder="Искать товар со скидками до 50% ">
    <i class="fa-regular fa-magnifying-glass"></i>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.header-search {
  flex: 1;
  min-width: 0;
  border: 2px solid rgb($blue, 0.3);
  border-radius: $border-radius;

  @include flex-center;
  gap: 24px;

  padding-inline: 20px;

  flex: 1;
  height: 48px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: rgba($blue, 1);

    i {
      color: rgba($dark-blue, 1);
    }
  }

  input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;

    &::placeholder {
      color: rgba($dark-blue, 0.5);
    }
  }

  i {
    color: rgba($dark-blue, 0.5);
  }


}
</style>
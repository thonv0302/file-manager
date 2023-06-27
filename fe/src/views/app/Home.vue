<script setup>
import { useLocalStorage } from '@vueuse/core';

const showSidebar = useLocalStorage('show-sidebar');
</script>
<template>
  <h1 class="text-3xl font-bold underline">Hello world!</h1>
  <pre>{{ showSidebar }}</pre>
</template>
<style lang="scss" scoped></style>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Custom from '../src/layouts/Custom.vue';
import Default from '../src/layouts/Default.vue';

const AUTH_ROUTE = {
  auth: ['Login', 'Register'],
};
const route = useRoute();

const layoutChose = computed(() => {
  if (AUTH_ROUTE.auth.includes(route.name)) {
    return Default;
  } else {
    return Custom;
  }
});

onMounted(() => {
  window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
});

onUnmounted(() => {
  window.removeEventListener('contextmenu');
});
</script>

<template>
  <Transition name="fade" mode="out-in">
    <component :is="layoutChose">
      <RouterView :key="$route.fullPath"> </RouterView>
    </component>
  </Transition>
  <notifications />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

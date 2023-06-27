<script setup>
import TheHeader from '../components/TheHeader.vue';
import TheSidebar from '../components/TheSidebar.vue';
</script>
<template>
  <div>
    <TheSidebar />
    <div class="md:pl-64 flex flex-col flex-1">
      <TheHeader />
      <!-- < -->
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>

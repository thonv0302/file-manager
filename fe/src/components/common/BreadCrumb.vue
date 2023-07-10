<script setup>
import { useRoute } from 'vue-router';

defineProps({
  pages: {
    type: Array,
    default: () => [],
  },
});

const route = useRoute();
</script>
<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol role="list" class="flex items-center space-x-1">
      <li v-for="(page, index) in pages" :key="page.name">
        <div class="flex items-center">
          <svg
            v-if="index !== 0"
            class="flex-shrink-0 h-5 w-5 text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
          </svg>
          <RouterLink
            :to="`/documents/${page.id}`"
            :class="[
              'font-medium text-gray-500 hover:text-gray-700',
              {
                'ml-1': index !== 0,
              },
            ]"
            >{{ page.name }}</RouterLink
          >
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();

const { item } = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});

const routeFolder = () => {
  if (item.isFolder) {
    router.push({
      name: 'Documents',
      params: {
        blockId: item._id,
      },
    });
  }
};
</script>

<template>
  <div
    @click="routeFolder"
    class="group relative block w-full aspect-[1] rounded-lg focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden"
  >
    <img
      :src="item.fileUrl"
      alt=""
      :class="[
        'absolute object-cover pointer-events-none group-hover:opacity-75',
        {
          'top-[-50%]': !item.isFolder,
        },
      ]"
    />
    <button type="button" class="absolute inset-0 focus:outline-none">
      <span class="sr-only">View details for {{ item.name }}</span>
    </button>
  </div>
  <p
    class="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none name"
  >
    {{ item.name }}
  </p>
  <p class="block text-sm font-medium text-gray-500 pointer-events-none">
    {{ item.size }} mb
  </p>
</template>

<style scoped>
.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

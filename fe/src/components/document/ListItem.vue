<script setup>
import { useTimeAgo } from '@vueuse/core';
import { useRouter } from 'vue-router';
import convertFileSize from '../../utils/convertFileSize';

const router = useRouter();

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
  <p @click="routeFolder" class="text-sm flex-1 cursor-pointer name">
    {{ item.name }}
  </p>
  <div @click="routeFolder" class="flex-1 cursor-pointer">
    <div class="w-16 h-16 overflow-hidden rounded-md">
      <img :src="item.fileUrl" />
    </div>
  </div>
  <p @click="routeFolder" class="text-sm flex-1">
    {{ convertFileSize(item.size) }}
  </p>
  <p @click="routeFolder" class="text-sm flex-1">
    {{ useTimeAgo(item.createdAt) }}
  </p>
</template>

<style scoped>
.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

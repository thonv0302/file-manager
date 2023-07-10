<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import convertFileSize from '../../utils/convertFileSize';
import { onClickOutside } from '@vueuse/core';
import FolderIcon from '../../assets/icons/folder.png';

const router = useRouter();

const { item, modelValue } = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  item: {
    type: Object,
    default: () => {},
  },
});

const target = ref(null);

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

const emits = defineEmits(['clickElement', 'update:modelValue']);

onClickOutside(target, () => {
  emits('update:modelValue', '');
});
</script>

<template>
  <div
    class="relative p-3"
    ref="target"
    @dblclick="routeFolder"
    @click.right="emits('update:modelValue', item._id)"
  >
    <div class="group relative block aspect-[1] rounded-lg overflow-hidden">
      <img
        :src="!item.isFolder ? item.fileUrl : FolderIcon"
        alt=""
        :class="[
          'absolute pointer-events-none group-hover:opacity-75 top-1/2 -translate-y-1/2',
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
      {{ convertFileSize(item.size) }}
    </p>
  </div>
</template>

<style scoped>
.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

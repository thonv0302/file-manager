<script setup>
import { useRoute } from 'vue-router';
import { useLocalStorage } from '@vueuse/core';
import { XMarkIcon } from '@heroicons/vue/24/solid';
import useDevice from '../composables/useDevice';

const route = useRoute();
const { smAndSmaller } = useDevice();

const navigation = [{ name: 'Documents', href: '/document', icon: '' }];

const showSidebar = useLocalStorage('show-sidebar');
</script>

<template>
  <div
    :class="[
      'fixed h-full w-64 border-r border-gray-200 flex-1 flex flex-col max-w-xs pt-5 pb-4 bg-white z-30 md:z-10',
      {
        'left-[-100%]': smAndSmaller && showSidebar == 'false',
      },
    ]"
  >
    <div class="absolute top-0 right-0 -mr-12 pt-2">
      <button
        @click.stop="showSidebar = 'false'"
        type="button"
        class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
      >
        <span class="sr-only">Close sidebar</span>
        <XMarkIcon class="h-6 w-6 text-white" />
      </button>
    </div>
    <div class="flex-shrink-0 flex items-center px-4">
      <img
        class="h-8 w-auto"
        src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
        alt="Workflow"
      />
    </div>
    <div class="mt-5 flex-1 h-0 overflow-y-auto">
      <nav class="px-2 space-y-1">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="{
            name: item.name,
          }"
          :class="[
            ' text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md',
            {
              'text-gray-600 hover:bg-gray-50 hover:text-gray-900 bg-gray-100':
                route.name == item.name,
            },
          ]"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
    </div>
  </div>
  <div
    v-if="smAndSmaller && showSidebar == 'true'"
    class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-[25]"
  ></div>
</template>

<style scoped></style>

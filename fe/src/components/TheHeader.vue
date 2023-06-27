<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onClickOutside, useLocalStorage } from '@vueuse/core';
import { useAuthStore } from '../stores/useAuthStore';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const authStore = useAuthStore();
const target = ref(null);
const showDropdown = ref(false);
const showSidebar = useLocalStorage('show-sidebar', false);

onClickOutside(target, () => {
  showDropdown.value = false;
});

const logout = async () => {
  await authStore.logout();
  router.push({ name: 'Login' });
};
</script>
<template>
  <div
    class="sticky top-0 z-20 flex-shrink-0 flex items-center h-16 bg-white shadow"
  >
    <button
      type="button"
      class="p-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
      @click="showSidebar = 'true'"
    >
      <span class="sr-only">Open sidebar</span>
      <Bars3Icon class="h-6 w-6" />
    </button>
    <div class="flex-1 px-4 flex justify-between">
      <div class="flex-1 flex">
        <form class="w-full flex md:ml-0" action="#" method="GET">
          <label for="search-field" class="sr-only">Search</label>
          <div class="relative w-full text-gray-400 focus-within:text-gray-600">
            <div
              class="absolute inset-y-0 left-0 flex items-center pointer-events-none"
            >
              <MagnifyingGlassIcon class="h-5 w-5" />
            </div>
            <input
              id="search-field"
              class="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
              placeholder="Search"
              type="search"
              name="search"
            />
          </div>
        </form>
      </div>
      <div class="ml-4 flex items-center md:ml-6">
        <div class="ml-3 relative" ref="target">
          <div @click="showDropdown = !showDropdown">
            <button
              class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Open user menu</span>
              <img
                class="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </button>
          </div>
          <div
            v-if="showDropdown"
            class="origin-top-right absolute right-0 mt-2 min-w-[120px] rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <a
              href=""
              :class="[' bg-gray-100', 'block px-4 py-2 text-sm text-gray-700']"
            >
              Your profile
            </a>
            <a
              role="button"
              @click="logout"
              :class="[
                !active ?? ' bg-gray-100',
                'block px-4 py-2 text-sm text-gray-700',
              ]"
            >
              Sign out
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

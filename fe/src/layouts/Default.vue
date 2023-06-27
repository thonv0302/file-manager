<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
<template>
  <div
    class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        {{
          route.name === 'Login'
            ? 'Sign in to your account'
            : 'Sign up to your account'
        }}
      </h2>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="md:bg-white py-8 md:px-4 md:shadow sm:rounded-lg sm:px-10">
        <slot />
      </div>
    </div>
  </div>
</template>

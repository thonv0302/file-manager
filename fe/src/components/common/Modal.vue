<script setup>
defineProps({
  title: {
    type: String,
    require: true,
  },
});

const emits = defineEmits(['save', 'close']);
</script>
<template>
  <div class="fixed z-40 inset-0 overflow-y-auto">
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        @click.stop="emits('close')"
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      ></div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full w-[500px]"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- class="sm:flex sm:items-start" -->
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                New folder
              </h3>
              <div class="mt-2">
                <slot />
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="w-full inline-flex justify-center text-white rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-indigo-500 focus-visible:outline-indigo-600 sm:ml-3 sm:w-auto sm:text-sm"
            @click.stop="emits('save')"
          >
            Save
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click.stop="emits('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

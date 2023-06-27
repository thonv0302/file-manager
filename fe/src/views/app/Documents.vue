<script setup>
import { computed, onMounted, ref } from 'vue';
import {
  TableCellsIcon,
  ListBulletIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowUpTrayIcon,
} from '@heroicons/vue/24/solid';
import { useLocalStorage } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import GridItem from '../../components/document/gridItem.vue';
import ListItem from '../../components/document/ListItem.vue';
import awsService from '../../services/awsServices';
import Modal from '../../components/common/Modal.vue';
import BreadCrumb from '../../components/common/BreadCrumb.vue';

import { useAuthStore } from '../../stores/useAuthStore';
import { useBlockStore } from '../../stores/useBlockStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const blockStore = useBlockStore();
const { listBlock, listBreadCrumb } = storeToRefs(blockStore);

const displayDocumentType = useLocalStorage('display-document-type', 'grid');

const progressUploadFiles = ref([]);
const previewFiles = async (e) => {
  let filesNameExist = [...e.target.files].map((file) => ({
    name: file.name,
    parentFolder: route.params.blockId ?? '',
  }));

  const nameArr = await Promise.all(
    filesNameExist.map((file) => blockStore.generateName(file))
  );

  let files = [...e.target.files].map((file, index) => ({
    name: nameArr[index],
    path: user.value.user._id + '/documents/' + currentFolderName.value + nameArr[index],
    file,
    percent: 0,
  }));

  // Get url uploads
  const { data } = await awsService.getUploadUrls(
    files.map((file) => file.path)
  );

  files = files.map((file, index) => ({
    ...file,
    path: data.metadata.urlPuts[index]
  }))

  await Promise.all(files.map(file => awsService.uploadFile(file.file, file.path, (percent) => {
    file.percent = percent
  })))
};

const isOpenCreateFolder = ref(false);
const folderName = ref('');
const form = ref(null);
`  `;

const createFolder = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  const body = {
    name: folderName.value,
    isFolder: true,
    parentFolder: route.params.blockId || '',
  };

  const block = await blockStore.createBlock(body);

  if (route.params.blockId) {
    const parentBlock = await blockStore.getOneBlock(route.params.blockId);
    const blockAncestorFolder = block.ancestorFolders;
    blockAncestorFolder.push({
      ancestorId: parentBlock._id,
      ancestorName: parentBlock.name,
    });
    await blockStore.updateBlock(block._id, {
      ancestorFolders: blockAncestorFolder,
    });
  }

  blockStore.getBlock(route.params);
  folderName.value = '';
  isOpenCreateFolder.value = false;
};

onMounted(() => {
  blockStore.getBlock(route.params);
  blockStore.getBreadcrumb(route.params.blockId);
});

const breadCrumb = computed(() => [
  {
    name: 'Document',
    id: '',
  },
  ...listBreadCrumb.value,
]);

const currentFolderName = computed(() => {
  const id = route.params.blockId;
  const breadCrumbFound = breadCrumb.value.find(bread => bread.id === id)
  if (breadCrumbFound) {
    return `${breadCrumbFound.name}/`
  }
  return '';
})
</script>
<template>
  <div class="py-6">
    <div class="max-w-7xl flex justify-between items-center mx-auto px-4 sm:px-6 md:px-8 mb-6">
      <div class="flex">
        <button @click="router.go(-1)" class="p-2">
          <ArrowLeftIcon class="h-4 w-4 mr-2" />
        </button>
        <BreadCrumb :pages="breadCrumb" />
      </div>
      <button @click="isOpenCreateFolder = true"
        class="flex items-center rounded-md px-3 p-1.5 text-sm font-semibold leading-6 text-white bg-indigo-600 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-indigo-500 focus-visible:outline-indigo-600">
        <PlusIcon class="h-4 w-4 mr-2" /><span>Folder</span>
      </button>
    </div>
    <div class="max-w-7xl flex justify-between items-center mx-auto px-4 sm:px-6 md:px-8">
      <div>filter</div>
      <div>
        <button @click="displayDocumentType = 'grid'" v-if="displayDocumentType != 'grid'">
          <TableCellsIcon class="h-8 w-8" />
        </button>
        <button @click="displayDocumentType = 'list'" v-if="displayDocumentType != 'list'">
          <ListBulletIcon class="h-8 w-8" />
        </button>
      </div>
    </div>
    <div :class="[
      'max-w-7xl mx-auto px-4  lg:px-8  md:w-full',
      {
        'w-[calc(100vw-32px)] overflow-y-auto': displayDocumentType == 'list',
      },
    ]">
      <div :class="[
        'py-4',
        {
          'min-w-[500px]': displayDocumentType == 'list',
        },
      ]">
        <div v-if="displayDocumentType == 'list'" class="flex justify-between gap-x-4">
          <h3 class="flex-1 font-semibold mb-2">Title</h3>
          <h3 class="flex-1 font-semibold mb-2">Image</h3>
          <h3 class="flex-1 font-semibold mb-2">Size</h3>
          <h3 class="flex-1 font-semibold mb-2">Created at</h3>
        </div>
        <ul role="list" :class="[
          {
            'grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8':
              displayDocumentType == 'grid',
          },
        ]">
          <li v-for="file in listBlock" :key="file._id" :class="[
            'relative',
            {
              'flex justify-between items-center gap-x-4 mb-2':
                displayDocumentType == 'list',
            },
          ]">
            <GridItem :item="file" v-if="displayDocumentType == 'grid'" />
            <ListItem :item="file" v-else />
          </li>
        </ul>
      </div>
    </div>
    <button
      class="fixed bottom-6 right-6 md:bottom-12 md:right-12 flex items-center rounded-md px-4 p-2 text-sm font-semibold leading-6 text-white bg-indigo-600 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-indigo-500 focus-visible:outline-indigo-600">
      <ArrowUpTrayIcon class="h-4 w-4 mr-2" /> Upload
      <input class="absolute top-0 left-0 right-0 bottom-0 opacity-0" type="file" multiple @change="previewFiles" />
    </button>
  </div>
  <Modal title="New folder" @save="createFolder" v-if="isOpenCreateFolder" @close="isOpenCreateFolder = false">
    <VeeForm v-slot="{ errors }">
      <VeeField name="folder" type="text" rules="required" v-model="folderName" ref="form" :class="[
        'block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none',
        {
          'ring-red-500 border-red-500 focus:ring-red-500 focus:border-red-500':
            errors.folder,
        },
      ]" />
      <ErrorMessage name="folder" class="mt-2 text-sm text-red-600" />
    </VeeForm>
  </Modal>
  <pre>{{ currentFolderName }}</pre>
  <pre>{{ breadCrumb }}</pre>
</template>

<style lang="scss" scoped></style>

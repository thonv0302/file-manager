<script setup>
import { computed, onMounted, ref } from 'vue';
import {
  TableCellsIcon,
  ListBulletIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/solid';
import { useLocalStorage } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { RouterLink, useRoute, useRouter } from 'vue-router';
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

const currentFolderName = computed(() => {
  return listBreadCrumb.value.map((bread) => `${bread.name}/`).join('');
});

const realUrl = (string) => {
  return string.split('?').length > 1 ? string.split('?')[0] : string;
};

const files = ref([]);
const previewFiles = async (e) => {
  let filesNameExist = [...e.target.files].map((file) => ({
    name: file.name,
    parentFolder: route.params.blockId ?? '',
  }));

  try {
    const nameArr = await Promise.all(
      filesNameExist.map((file) => blockStore.generateName(file))
    );

    files.value = [...e.target.files].map((file, index) => ({
      name: nameArr[index],
      fileUrl:
        user.value.user._id +
        '/documents/' +
        currentFolderName.value +
        nameArr[index],
      file,
      size: file.size,
      fileType: file.type,
      parentFolder: route.params.blockId,
      percent: 0,
    }));

    // Get url uploads
    const { urlPuts } = await awsService.getUploadUrls(
      files.value.map((file) => file.fileUrl)
    );

    files.value = files.value.map((file, index) => ({
      ...file,
      fileUrl: urlPuts[index],
    }));

    await Promise.all(
      files.value.map((file) =>
        awsService.uploadFile(file.file, file.fileUrl, (percent) => {
          file.percent = percent;
        })
      )
    );

    files.value = files.value.map((file) => ({
      name: file.name,
      fileUrl: realUrl(file.fileUrl),
      size: file.size,
      fileType: file.fileType,
      parentFolder: file.parentFolder,
      percent: 0,
    }));

    const blockCreate = await Promise.all(
      files.value.map((file) => blockStore.createBlock(file))
    );

    await Promise.all(
      blockCreate.map((block) =>
        addParentFolderToAncestor(route.params.blockId, block._id)
      )
    );
    await blockStore.getBlock(route.params);
  } catch (error) { }
};

const isOpenCreateFolder = ref(false);
const folderName = ref('');
const form = ref(null);

const createFolder = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  const body = {
    name: folderName.value,
    isFolder: true,
    parentFolder: route.params.blockId || '',
  };

  try {
    const block = await blockStore.createBlock(body);
    if (route.params.blockId) {
      await addParentFolderToAncestor(route.params.blockId, block._id);
    }

    blockStore.getBlock(route.params);
    folderName.value = '';
    isOpenCreateFolder.value = false;
  } catch (error) {
    console.log('error: ', error);
  }
};

const addParentFolderToAncestor = async (blockParentId, blockId) => {
  const parentBlock = await blockStore.getOneBlock(blockParentId);
  parentBlock.ancestorFolders.push({
    ancestorId: parentBlock._id,
    ancestorName: parentBlock.name,
  });

  await blockStore.updateBlock(blockId, {
    ancestorFolders: parentBlock.ancestorFolders,
  });
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

const sortOptions = ref([
  {
    name: 'Name',
    query: {
      name: ''
    }
  },
  {
    name: 'Size',
  },
  {
    name: 'Date'
  }
])
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
      <!-- <div>filter</div> -->
      <div as="div" class="relative z-10 inline-block text-left">
        <div class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
          Sort
          <ChevronDownIcon class="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true" />
        </div>
        <ul
          class="origin-top-left absolute left-0 z-10 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <li class="py-1">
            <!-- :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-900']" -->
            <div v-for="option in sortOptions" :key="option">
              <RouterLink :to="{
                name: 'Documents',
                query: {
                  name: 'tho'
                }
              }" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-900']">
                {{ option.name }}
              </RouterLink>
            </div>
          </li>
        </ul>

      </div>
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
</template>

<style lang="scss" scoped></style>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import {
  TableCellsIcon,
  ListBulletIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  XMarkIcon,
  DocumentIcon,
  CheckIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from '@heroicons/vue/24/solid';
// import { TrashIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/solid';

import {
  useLocalStorage,
  onClickOutside,
  useMouse,
  useMagicKeys,
} from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import GridItem from '../../components/document/gridItem.vue';
import ListItem from '../../components/document/ListItem.vue';
import awsService from '../../services/awsServices';
import Modal from '../../components/common/Modal.vue';
import BreadCrumb from '../../components/common/BreadCrumb.vue';
import { useAuthStore } from '../../stores/useAuthStore';
import { useBlockStore } from '../../stores/useBlockStore';
import { useBlockSelection } from '../../composables/useBlockSelection';

const blockSelection = useBlockSelection();
const { control } = useMagicKeys();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const target = ref(null);
const showDropdown = ref(false);

onClickOutside(target, () => {
  showDropdown.value = false;
});

const { x, y } = useMouse();

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
      percent: file.percent,
    }));

    const blockCreate = await Promise.all(
      files.value.map((file) => blockStore.createBlock(file))
    );
    if (route.params.blockId) {
      await Promise.settle(
        blockCreate.map((block) =>
          addParentFolderToAncestor(route.params.blockId, block._id)
        )
      );
    }
  } catch (error) {}
  await blockStore.getBlock(route.params, route.query);
  if (route.params.blockId)
    await blockStore.caclSizeFolder(route.params.blockId);
};

const isOpenCreateFolder = ref(false);
const folderName = ref('');
const form = ref(null);

const suffixPath = computed(() => {
  if (listBreadCrumb.value.length > 0) {
    return listBreadCrumb.value.map((e) => `/${e.name}`).join('');
  }
  return '';
});

const createFolder = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  const body = {
    name: folderName.value,
    isFolder: true,
    parentFolder: route.params.blockId || '',
    fileUrl: user.value.user._id + '/documents' + suffixPath.value,
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
  parentBlock.ancestorFolders.push(parentBlock._id);

  await blockStore.updateBlock(blockId, {
    ancestorFolders: parentBlock.ancestorFolders,
  });
};

onMounted(() => {
  blockStore.getBlock(route.params, route.query);
  blockStore.getBreadcrumb(route.params.blockId || '');
});

const breadCrumb = computed(() => [
  {
    name: 'Document',
    id: '',
  },
  ...listBreadCrumb.value,
]);

const sortOptions = computed(() => [
  {
    name: 'Name: A to Z',
    query: {
      _sort: 'name',
      _order: 'asc',
    },
  },
  {
    name: 'Name: Z to A',
    query: {
      _sort: 'name',
      _order: 'desc',
    },
  },
  {
    name: 'Size: Low to High',
    query: {
      _sort: 'size',
      _order: 'asc',
    },
  },
  {
    name: 'Size: High to Low',
    query: {
      _sort: 'size',
      _order: 'desc',
    },
  },
  {
    name: 'Date: Lastest',
    query: {
      _sort: 'createdAt',
      _order: 'asc',
    },
  },
  {
    name: 'Date: Newest',
    query: {
      _sort: 'createdAt',
      _order: 'desc',
    },
  },
]);

const isActive = computed(() => (option) => {
  return (
    Boolean(
      option.query._sort === route.query._sort &&
        option.query._order === route.query._order
    ) ||
    Boolean(
      !route.query._sort &&
        !route.query._order &&
        option.query._sort === 'createdAt' &&
        option.query._order === 'desc'
    )
  );
});

const separateFileAndFolder = computed(() => (type) => {
  if (type) {
    return listBlock.value.filter((block) => block.isFolder);
  }

  return listBlock.value.filter((block) => !block.isFolder);
});

const currentActiveId = ref('');

const currentPosition = reactive({
  x: 0,
  y: 0,
});
const openOpen = (event, item) => {
  currentPosition.x = x.value;
  currentPosition.y = y.value;
  if (item) {
    currentActiveId.value = item._id;
  } else {
    currentActiveId.value = 'no-id';
    blockSelection.clear();
  }
};

const uploadInput = ref(null);

const sortBlocks = (option) => {
  router.replace({
    name: 'Documents',
    params: {
      blockId: route.params.blockId || '',
    },
    query: option.query,
  });
};

// const
const chooseBlock = (item) => {
  if (control.value) {
    blockSelection.toggle(item);
  } else {
    blockSelection.addOne(item);
  }
};

const deleteFilesAndFolders = async () => {
  const listDeleteIds = [...blockSelection.blocks].map((block) => block._id);
  if (listDeleteIds.length > 0) {
    await blockStore.deleteBlocks(listDeleteIds);
    await blockStore.getBlock(route.params, route.query);
    if (route.params.blockId)
      await blockStore.caclSizeFolder(route.params.blockId);
  }
};
</script>
<template>
  <div class="py-6">
    <div
      class="max-w-7xl flex justify-between items-center mx-auto px-4 sm:px-6 md:px-8 mb-6"
    >
      <div class="flex">
        <button
          @click="
            () => {
              router.replace({ query: {} });
              router.go(-1);
            }
          "
          class="p-2"
        >
          <ArrowLeftIcon class="h-4 w-4" />
        </button>
        <BreadCrumb :pages="breadCrumb" class="ml-2" />
      </div>
      <button
        @click="isOpenCreateFolder = true"
        class="flex items-center rounded-md px-3 p-1.5 text-sm font-semibold leading-6 text-white bg-indigo-600 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-indigo-500 focus-visible:outline-indigo-600"
      >
        <PlusIcon class="h-4 w-4 mr-2" /><span>Folder</span>
      </button>
    </div>
    <div
      class="max-w-7xl flex justify-between items-center mx-auto px-4 sm:px-6 md:px-8"
    >
      <div class="relative z-10 inline-block text-left" ref="target">
        <div
          class="group inline-flex justify-center font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
          @click.stop="showDropdown = !showDropdown"
        >
          Sort
          <ChevronDownIcon
            class="flex-shrink-0 -mr-1 ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </div>

        <ul
          v-if="showDropdown"
          class="origin-top-left absolute left-0 z-10 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <li class="py-1" @click.stop="showDropdown = false">
            <div v-for="option in sortOptions" :key="option">
              <div
                @click="sortBlocks(option)"
                :class="[
                  'block px-4 py-2 text-sm text-gray-900 cursor-pointer',
                  {
                    'bg-gray-50': isActive(option),
                  },
                ]"
              >
                {{ option.name }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <button
          @click="displayDocumentType = 'grid'"
          v-if="displayDocumentType != 'grid'"
        >
          <TableCellsIcon class="h-8 w-8" />
        </button>
        <button
          @click="displayDocumentType = 'list'"
          v-if="displayDocumentType != 'list'"
        >
          <ListBulletIcon class="h-8 w-8" />
        </button>
      </div>
    </div>
    <!-- List Grid folders and files -->
    <div
      id="area"
      :class="[
        'max-w-7xl mx-auto px-4 lg:px-8 md:w-full min-h-[80vh] relative',
        {
          'w-[calc(100vw-32px)] overflow-y-auto': displayDocumentType == 'list',
        },
      ]"
      @click="
        currentActiveId = '';
        blockSelection.clear();
      "
      @click.right="openOpen($event)"
    >
      <div
        :class="[
          'py-4',
          {
            'min-w-[500px]': displayDocumentType == 'list',
          },
        ]"
      >
        <div
          v-if="displayDocumentType == 'list'"
          class="flex justify-between gap-x-2"
        >
          <h3 class="flex-1 font-semibold mb-2">Title</h3>
          <h3 class="flex-1 font-semibold mb-2">Image</h3>
          <h3 class="flex-1 font-semibold mb-2">Size</h3>
          <h3 class="flex-1 font-semibold mb-2">Created at</h3>
        </div>
        <h6
          v-if="
            displayDocumentType == 'grid' &&
            separateFileAndFolder(true).length > 0
          "
          class="font-semibold mb-5"
        >
          Folders
        </h6>
        <ul
          role="list"
          :class="[
            {
              'grid grid-cols-2 gap-x-2 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-5 xl:gap-x-':
                displayDocumentType == 'grid',
            },
            {
              'pb-10': separateFileAndFolder(true).length > 0,
            },
          ]"
        >
          <li
            v-if="
              displayDocumentType == 'grid' &&
              separateFileAndFolder(true).length > 0
            "
            v-for="file in separateFileAndFolder(true)"
            :key="file._id"
            :class="[
              'relative rounded-lg overflow-hidden',
              {
                'bg-slate-200': blockSelection.blocks.has(file),
              },
            ]"
            @click.right.stop="openOpen($event, file)"
            @click.stop="chooseBlock(file)"
            @contextmenu.prevent
          >
            <GridItem :item="file" v-model="currentActiveId" />
          </li>
          <li
            v-if="displayDocumentType == 'list'"
            v-for="file in listBlock"
            :key="file._id"
            class="flex justify-between items-center gap-x-2 mb-2"
          >
            <ListItem :item="file" />
          </li>
        </ul>
        <hr
          v-if="
            displayDocumentType == 'grid' &&
            separateFileAndFolder(true).length > 0 &&
            separateFileAndFolder(false).length > 0
          "
        />
        <h6
          v-if="
            displayDocumentType == 'grid' &&
            separateFileAndFolder(true).length > 0 &&
            separateFileAndFolder(false).length > 0
          "
          :class="[
            'font-semibold mb-5',
            {
              'mt-10': separateFileAndFolder(false).length > 0,
            },
          ]"
        >
          Files
        </h6>
        <ul
          role="list"
          :class="[
            {
              'grid grid-cols-2 gap-x-2 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-5 xl:gap-x-':
                displayDocumentType == 'grid',
            },
          ]"
        >
          <li
            v-if="
              displayDocumentType == 'grid' &&
              separateFileAndFolder(false).length > 0
            "
            v-for="file in separateFileAndFolder(false)"
            :key="file._id"
            :class="[
              'relative rounded-lg overflow-hidden',
              {
                'bg-slate-200': blockSelection.blocks.has(file),
              },
            ]"
            @click.right.stop="openOpen($event, file)"
            @click.stop="chooseBlock(file)"
            @contextmenu.prevent
          >
            <GridItem :item="file" v-model="currentActiveId" />
          </li>
        </ul>
      </div>

      <Teleport to="#app">
        <div
          @click.stop
          v-if="currentActiveId === 'no-id'"
          :class="[
            'absolute mt-2 min-w-[120px] rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none',
          ]"
          :style="{
            left: `${currentPosition.x}px`,
            top: `${currentPosition.y}px`,
          }"
        >
          <a
            @click="isOpenCreateFolder = true"
            role="button"
            :class="[
              ' bg-gray-50',
              'flex items-center px-4 py-2 text-sm text-gray-700',
            ]"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            <span>Folder</span>
          </a>
          <a
            role="button"
            :class="[
              'flex relative items-center px-4 py-2 text-sm text-gray-700',
            ]"
            @click="
              () => {
                uploadInput.click();
                currentActiveId = '';
              }
            "
          >
            <ArrowUpTrayIcon class="h-4 w-4 mr-2" /> Upload
          </a>
        </div>
        <div
          @click.stop
          v-else-if="currentActiveId && currentActiveId !== 'no-id'"
          :class="[
            'absolute mt-2 min-w-[120px] rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none',
          ]"
          :style="{
            left: `${currentPosition.x}px`,
            top: `${currentPosition.y}px`,
          }"
        >
          <a
            role="button"
            :class="[
              ' bg-gray-100',
              'flex items-center px-4 py-2 text-sm text-gray-700',
            ]"
          >
            <ArrowDownTrayIcon class="h-4 w-4 mr-2" /> <span>Download</span>
          </a>
          <a
            role="button"
            @click="deleteFilesAndFolders"
            :class="['flex items-center px-4 py-2 text-sm text-gray-700']"
          >
            <TrashIcon class="h-4 w-4 mr-2" /> Delete
          </a>
        </div>
      </Teleport>
    </div>
    <!-- Files upload -->
    <div
      v-if="files.length > 0"
      class="fixed w-[calc(100vw-1.5rem)] md:w-[450px] bottom-3 right-3 md:bottom-8 md:right-8 rounded-md shadow-xl bg-white overflow-hidden"
    >
      <div class="">
        <div class="flex justify-between p-3 bg-gray-50">
          <h6 class="font-semibold">Files upload</h6>
          <button class="p-2" @click="files = []">
            <XMarkIcon
              class="flex-shrink-0 -mr-1 ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
          </button>
        </div>
        <hr class="-mx-3" />
        <div class="bg-white px-3" v-for="(file, index) in files" :key="index">
          <div class="mb-3 flex mt-2">
            <div>
              <DocumentIcon class="w-10 text-indigo-600" />
            </div>
            <div class="w-full">
              <div class="flex justify-between">
                <p
                  class="block text-sm font-medium text-gray-900 truncate pointer-events-none max-w-[250px]"
                >
                  {{ file.name }}
                </p>
                <span v-if="file.percent < 100"
                  >{{ Math.floor(file.percent) }}%</span
                >
                <span v-else><CheckIcon class="w-4 h-4 text-green-600" /></span>
              </div>
              <div class="bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  class="h-2 bg-indigo-600 rounded-full"
                  :style="{ width: `${Math.floor(+file.percent)}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      v-else
      class="fixed bottom-6 right-6 md:bottom-12 md:right-12 flex items-center rounded-md px-4 p-2 text-sm font-semibold leading-6 text-white bg-indigo-600 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:bg-indigo-500 focus-visible:outline-indigo-600"
    >
      <ArrowUpTrayIcon class="h-4 w-4 mr-2" /> Upload
      <input
        accept="image/*"
        ref="uploadInput"
        class="absolute top-0 left-0 right-0 bottom-0 opacity-0"
        type="file"
        multiple
        @change="previewFiles"
      />
    </button>
  </div>
  <Modal
    title="New folder"
    @save="createFolder"
    v-if="isOpenCreateFolder"
    @close="isOpenCreateFolder = false"
  >
    <VeeForm v-slot="{ errors }" @sumit.prevent>
      <VeeField
        name="folder"
        type="text"
        rules="required"
        v-model="folderName"
        ref="form"
        :class="[
          'block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none',
          {
            'ring-red-500 border-red-500 focus:ring-red-500 focus:border-red-500':
              errors.folder,
          },
        ]"
      />
      <ErrorMessage name="folder" class="mt-2 text-sm text-red-600" />
    </VeeForm>
  </Modal>
</template>

<style lang="scss" scoped></style>

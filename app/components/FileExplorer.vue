<template>
  <div
    class="w-72 bg-neutral-800 shadow-lg h-full shrink-0 flex items-center justify-start p-2 flex-col gap-2"
  >
    <div class="flex items-center justify-between w-full pl-2 pr-1 gap-2">
      <h3 class="text-xl font-semibold">Files</h3>
      <div class="du-tooltip du-tooltip-bottom" data-tip="New File">
        <button
          class="hover:bg-neutral-700/75 p-1 transition translate-y-0.5 rounded-lg"
          type="button"
          @click="createNewFile"
        >
          <img
            class="size-5 invert"
            src="/document-outline.svg"
            alt="Click to create a new file"
          />
        </button>
      </div>
    </div>

    <div class="w-full h-full no-scrollbar">
      <div
        tabindex="0"
        role="button"
        v-for="(file, index) in files"
        class="cursor-pointer group hover:bg-neutral-700 transition w-full py-2 pl-4 pr-2 rounded-xl flex items-center justify-between"
        :class="{ 'bg-neutral-700/75': currentFileIndex === index }"
        @click="currentFileIndex = index"
      >
        <input
          ref="file-name-input"
          class="w-46"
          :class="{ 'outline-red-300': !nameIsValid }"
          v-show="currentlyEditingIndex === index"
          type="text"
          v-model="fileNameInputValue"
          @keydown.enter="submitNewFileName()"
          @blur="submitNewFileName(true)"
          @focus="console.log(currentlyEditingIndex)"
        />
        <p
          v-show="currentlyEditingIndex !== index"
          class="w-48 truncate text-left"
        >
          {{ file.name }}
        </p>

        <div class="du-tooltip ml-auto" data-tip="Rename file">
          <button
            class="hover:bg-neutral-600 p-1 transition rounded-lg"
            type="button"
            @click.stop="editFileName(index)"
          >
            <img
              class="size-5 invert"
              src="/pencil-outline.svg"
              :alt="`Click to rename ${file.name}`"
            />
          </button>
        </div>

        <div class="du-tooltip" data-tip="Delete file">
          <button
            class="hover:bg-neutral-600 p-1 transition rounded-lg"
            type="button"
            @click.stop="currentlyDeletingIndex = index"
          >
            <img
              class="size-5 invert"
              src="/trash-outline.svg"
              :alt="`Click to delete ${file.name}`"
            />
          </button>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition>
      <div
        class="w-dvw h-dvh bg-black/35 flex items-center justify-center fixed top-0 left-0 z-50"
        v-if="currentlyDeletingIndex !== undefined"
        @click="currentlyDeletingIndex = undefined"
      >
        <div
          class="menu bg-neutral-800 flex items-center justify-center flex-col p-10 gap-4 rounded-lg shadow-lg relative"
          @click.stop
        >
          <button
            class="absolute top-2 right-2 p-1 rounded-full hover:bg-neutral-700 transition"
            type="button"
            @click="currentlyDeletingIndex = undefined"
          >
            <img
              class="size-6 invert"
              src="/close-outline.svg"
              alt="Click to cancel"
            />
          </button>

          <h3 class="text-xl text-red-400 font-medium">
            Are you sure you want to delete
            <span class="text-red-400 text-xl font-semibold">{{
              files[currentlyDeletingIndex]?.name ?? "this file"
            }}</span
            >?
          </h3>
          <p class="font-medium">This action is irreversible!</p>

          <div class="flex items-center justify-center gap-4">
            <button
              class="bg-neutral-300 text-black rounded-full px-7 py-2 hover:bg-neutral-200 transition"
              type="button"
              @click="currentlyDeletingIndex = undefined"
            >
              Cancel
            </button>
            <button
              class="rounded-full px-7 py-2 hover:bg-red-600 transition"
              type="button"
              @click="userStore.deleteFile(currentlyDeletingIndex)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Teleport } from "vue";

const userStore = useUserStore();
const { files, currentFileIndex } = storeToRefs(userStore);

const currentlyEditingIndex = ref<number>();
const fileNameInput = useTemplateRef("file-name-input");
watch(currentlyEditingIndex, async (val, previousVal) => {
  if (val !== undefined) {
    await nextTick();
    fileNameInput.value?.[val]?.focus();
  } else {
    userStore.saveCode(previousVal!);
  }
});

const currentlyDeletingIndex = ref<number>();

const fileNameInputValue = ref("");
const nameIsValid = computed(() => {
  const length = fileNameInputValue.value.trim().length;
  if (length === 0 || length >= 100) return false;
  return true;
});

function editFileName(index: number) {
  fileNameInputValue.value = files.value[index]!.name;
  currentlyEditingIndex.value = index;
}

function submitNewFileName(once = false) {
  if (!fileNameInput.value || currentlyEditingIndex.value === undefined) return;
  if (!nameIsValid.value) {
    if (!once) return fileNameInput.value[currentlyEditingIndex.value]?.focus();
    currentlyEditingIndex.value = undefined;
    fileNameInputValue.value = "";
    return;
  }

  files.value[currentlyEditingIndex.value]!.name =
    fileNameInputValue.value.trim();
  currentlyEditingIndex.value = undefined;
  fileNameInputValue.value = "";
}

function createNewFile() {
  files.value.unshift({
    name: "",
    code: "",
    lastSaved: Date.now(),
    lastOpened: Date.now(),
  });
  currentlyEditingIndex.value = 0;
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-active .menu,
.v-leave-active .menu {
  transition: transform 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-from .menu,
.v-leave-to .menu {
  transform: scale(0);
}
</style>

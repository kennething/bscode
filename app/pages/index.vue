<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex flex-wrap gap-4 items-center justify-center w-full">
      <button class="size-50 bg-red-500" type="button" @click="createNewFile">
        create new
      </button>
      <button
        v-for="(file, index) in files"
        class="size-50 bg-blue-500"
        type="button"
        @click="selectFile(index)"
      >
        {{ file.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { files, currentFileIndex } = storeToRefs(userStore);
const router = useRouter();

function createNewFile() {
  const newFile = {
    name: "Untitled File",
    code: "",
    lastSaved: Date.now(),
    lastOpened: Date.now(),
  } satisfies CodeFile;

  files.value.push(newFile);
  currentFileIndex.value = files.value.length - 1;
  router.push("/editor");
}

function selectFile(index: number) {
  currentFileIndex.value = index;
  router.push("/editor");
}
</script>

<style scoped></style>

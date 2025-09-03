<template>
  <div class="flex flex-col items-center justify-center">
    <Header class="sticky top-0" />

    <div class="flex flex-wrap gap-4 items-center justify-center w-full p-4">
      <button
        class="w-100 h-40 rounded-lg flex flex-col pb-2 hover:bg-neutral-500 transition items-center justify-center gap-2 bg-neutral-600"
        type="button"
        @click="createNewFile"
      >
        <img class="size-16 invert" src="/add-outline.svg" aria-hidden="true" />
        <p class="text-xl font-semibold">Create New File</p>
      </button>

      <NuxtLink
        v-for="file in Object.values(files).sort(
          (a, b) => b.lastSaved - a.lastSaved
        )"
        :to="`/editor/${file.uuid}`"
        class="w-100 h-40 bg-neutral-800 py-2 px-4 shadow-lg overflow-hidden hover:bg-neutral-700 transition rounded-lg"
      >
        <h4 class="text-xl font-bold">{{ file.name }}</h4>
        <p>{{ getSize(file.code) }}</p>
        <p>Last saved {{ unixToDateString(file.lastSaved) }}</p>
        <p>Created {{ unixToDateString(file.createdAt) }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 } from "uuid";

const userStore = useUserStore();
const { files } = storeToRefs(userStore);
const router = useRouter();

function createNewFile() {
  const uuid = v4();
  files.value[uuid] = {
    uuid,
    name: "Untitled File",
    code: "",
    lastSaved: Date.now(),
    language: "JavaScript",
    createdAt: Date.now(),
  };
  console.log(uuid);

  localStorage.setItem("files", JSON.stringify(files.value));
  router.push(`/editor/${uuid}`);
}

function getSize(string: string) {
  const size = new Blob([string]).size;

  if (size / 1000000 > 1) return (size / 1000000).toFixed(2) + " MB";
  if (size / 1000 > 1) return (size / 1000).toFixed(2) + " KB";
  return size + " bytes";
}

function unixToDateString(timestamp: number) {
  const now = Date.now();
  const differenceInMs = now - timestamp;

  const minuteInMs = 60 * 1000;
  const hourInMs = 60 * minuteInMs;
  const dayInMs = 24 * hourInMs;
  const sevenDaysInMs = 7 * dayInMs;

  if (differenceInMs < minuteInMs) return "just now";

  if (differenceInMs < hourInMs && differenceInMs >= minuteInMs)
    return `${Math.floor(differenceInMs / minuteInMs)} minutes ago`;

  if (differenceInMs < dayInMs)
    return `${Math.floor(differenceInMs / hourInMs)} hours ago`;

  if (differenceInMs < sevenDaysInMs)
    return `${Math.floor(differenceInMs / dayInMs)} days ago`;

  return new Date(timestamp).toLocaleDateString();
}
</script>

<style scoped></style>

<template>
  <div class="flex flex-col items-center justify-center">
    <Header class="sticky top-0" />

    <div class="mt-4 flex items-center justify-center gap-4">
      <button
        v-for="(abbr, language) in languages"
        class="size-30 rounded-lg flex flex-col pb-1 hover:bg-neutral-500 transition items-center justify-center gap-2 bg-neutral-600"
        type="button"
        @click="createNewFile(language)"
      >
        <img class="size-12" :src="`/logos/${abbr}.svg`" aria-hidden="true" />
        <p class="text-lg font-semibold">New {{ abbr.toUpperCase() }} File</p>
      </button>
    </div>

    <div class="flex flex-wrap gap-4 items-center justify-center w-full p-4">
      <LazyNuxtLink
        v-for="file in Object.values(files).sort(
          (a, b) => b.lastSaved - a.lastSaved
        )"
        hydrate-on-visible
        :to="`/editor/${file.uuid}`"
        class="w-100 h-40 bg-neutral-800 py-2 px-4 shadow-lg overflow-hidden hover:bg-neutral-700 transition rounded-lg"
      >
        <div class="flex mb-3 items-center justify-start gap-2 w-full">
          <div class="du-tooltip" :data-tip="languages[file.language]">
            <img
              class="size-6"
              :src="`/logos/${languages[file.language]}.svg`"
              aria-hidden="true"
            />
          </div>
          <h4 class="text-xl w-80 overflow-ellipsis font-bold">
            {{ file.name }}
          </h4>
        </div>

        <p>{{ getSize(file.code) }}</p>
        <p>Last saved {{ unixToDateString(file.lastSaved) }}</p>
        <p>Created {{ unixToDateString(file.createdAt) }}</p>
      </LazyNuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 } from "uuid";

const userStore = useUserStore();
const { files } = storeToRefs(userStore);
const router = useRouter();

function createNewFile(language: Language) {
  const uuid = v4();
  files.value[uuid] = {
    uuid,
    name: "Untitled File",
    code: "",
    lastSaved: Date.now(),
    language,
    createdAt: Date.now(),
  };

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

  if (differenceInMs < hourInMs && differenceInMs >= minuteInMs) {
    const minutes = Math.floor(differenceInMs / minuteInMs);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (differenceInMs < dayInMs) {
    const hours = Math.floor(differenceInMs / hourInMs);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (differenceInMs < sevenDaysInMs) {
    const days = Math.floor(differenceInMs / dayInMs);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return new Date(timestamp).toLocaleDateString();
}
</script>

<style scoped></style>

<template>
  <div class="flex flex-col items-center justify-center"></div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { files } = storeToRefs(userStore);
const router = useRouter();

onMounted(() => {
  const fileUuids = Object.keys(files.value);
  if (!fileUuids.length) return router.replace("/");

  router.replace(`/editor/${files.value[fileUuids[0]!]!.uuid}`);
});
</script>

<style scoped></style>

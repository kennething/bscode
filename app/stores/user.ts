export const useUserStore = defineStore("userStore", () => {
  /** { [`uuid`]: `CodeFile` } */
  const files = ref<Record<string, CodeFile>>({});

  function saveCode(uuid: string, code?: string) {
    files.value[uuid]!.code = code ?? files.value[uuid]!.code;
    files.value[uuid]!.lastSaved = Date.now();
    localStorage.setItem("files", JSON.stringify(files.value));
  }

  function deleteFile(uuid: string) {
    delete files.value[uuid];
    localStorage.setItem("files", JSON.stringify(files.value));
  }

  return { files, saveCode, deleteFile };
});

export const useUserStore = defineStore("userStore", () => {
  const files = ref<CodeFile[]>([]);
  const currentFileIndex = ref<number>();

  function saveCode(index: number, code: string) {
    files.value[index]!.code = code;
    localStorage.setItem("files", JSON.stringify(files.value));
  }

  return { files, currentFileIndex, saveCode };
});

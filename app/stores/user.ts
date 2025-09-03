export const useUserStore = defineStore("userStore", () => {
  const router = useRouter();

  const files = ref<CodeFile[]>([]);
  const currentFileIndex = ref<number>();

  function saveCode(index: number, code?: string) {
    files.value[index]!.code = code ?? files.value[index]!.code;
    localStorage.setItem("files", JSON.stringify(files.value));
  }

  function deleteFile(index: number) {
    files.value.splice(index, 1);
    localStorage.setItem("files", JSON.stringify(files.value));
  }

  return { files, currentFileIndex, saveCode, deleteFile };
});

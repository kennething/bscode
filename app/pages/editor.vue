<template>
  <iframe
    ref="sandbox-frame"
    v-if="run"
    sandbox="allow-scripts"
    class="hidden absolute top-0 left-0"
    :srcdoc="iframeCode"
  ></iframe>

  <div class="w-full h-dvh flex flex-col items-center justify-center">
    <Header />

    <div class="w-full h-full flex items-center justify-center">
      <FileExplorer />

      <div ref="editor-container" class="w-full h-full"></div>

      <Console
        :sandbox-frame="sandboxFrame"
        :editor="monacoEditor"
        @update-iframe-code="(code) => (iframeCode = code)"
        @save-code="saveCode"
        v-model="run"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { editor } from "monaco-editor";

const userStore = useUserStore();
const { files, currentFileIndex } = storeToRefs(userStore);
const router = useRouter();

onBeforeMount(() => {
  if (currentFileIndex.value === undefined) {
    if (!files.value.length) return router.replace("/");
    currentFileIndex.value = 0;
  }
});

const editorContainer = useTemplateRef("editor-container");
const sandboxFrame = useTemplateRef("sandbox-frame");
const monacoEditor = shallowRef<editor.IStandaloneCodeEditor>();

const run = ref(false);
const code = ref("");
const iframeCode = ref("");

async function saveCode() {
  if (!monacoEditor.value || currentFileIndex.value === undefined) return;

  let code = monacoEditor.value.getValue();
  if (!code.endsWith("\n")) {
    const position = monacoEditor.value.getPosition();
    code += "\n";
    monacoEditor.value.setValue(code);
    if (position) monacoEditor.value.setPosition(position);
  }
  userStore.saveCode(currentFileIndex.value, code);
}

function handleHotkeys(event: KeyboardEvent) {
  if (event.ctrlKey && event.key === "s") {
    console.log("a");
    event.preventDefault();
    saveCode();
  }
}
onMounted(() => window.addEventListener("keypress", handleHotkeys));
onUnmounted(() => window.removeEventListener("keypress", handleHotkeys));

function initializeEditor() {
  monacoEditor.value = monaco.editor.create(editorContainer.value!, {
    value: files.value[currentFileIndex.value ?? 0]?.code,
    language: "javascript",
    theme: "vs-dark",
  });

  monaco.languages.registerHoverProvider("javascript", {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const lineText = model.getLineContent(position.lineNumber);

      const consoleTooltip = insertConsoleTooltips(word.word, lineText);
      if (consoleTooltip) return consoleTooltip;

      const mathTooltip = insertMathTooltips(word.word, lineText);
      if (mathTooltip) return mathTooltip;
    },
  });

  // monaco.languages.registerCompletionItemProvider("javascript", {
  //   triggerCharacters: ["."],
  //   provideCompletionItems: (model, position) => {
  //     const word = model.getWordAtPosition(position);
  //     const lineText = model.getLineContent(position.lineNumber);

  //     if (word && lineText.includes("console."))
  //       return {
  //         suggestions: Object.entries(consoleTooltips).map(
  //           ([key, value]) => ({
  //             label: key,
  //             kind:
  //               value.type === "method"
  //                 ? monaco.languages.CompletionItemKind.Method
  //                 : monaco.languages.CompletionItemKind.Property,
  //             insertText: `${key}${value.type === "method" ? "()" : ""}`,
  //             range: new monaco.Range(
  //               position.lineNumber,
  //               word.startColumn,
  //               position.lineNumber,
  //               word.endColumn
  //             ),
  //           })
  //         ),
  //       };
  //   },
  // });
}
watch(
  editorContainer,
  () => {
    initializeEditor();
    watch(currentFileIndex, initializeEditor);
  },
  { once: true }
);
</script>

<style scoped>
* {
  font-family: Comic Sans MS;
}
</style>

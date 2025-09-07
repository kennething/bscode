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
        :current-file="currentFile"
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
import { editor } from "monaco-editor";

const userStore = useUserStore();
const { files } = storeToRefs(userStore);
const route = useRoute();
const router = useRouter();

const uuid = String(route.params.uuid);

const currentFile = computed(() => {
  if (!uuid) return void router.replace("/");

  const file = files.value[uuid];
  if (!file) return void router.replace("/");

  return file;
});

const editorContainer = useTemplateRef("editor-container");
const sandboxFrame = useTemplateRef("sandbox-frame");
const monacoEditor = shallowRef<editor.IStandaloneCodeEditor>();

const run = ref(false);
const iframeCode = ref("");

async function saveCode() {
  if (!monacoEditor.value) return;

  let code = monacoEditor.value.getValue();
  if (!code.endsWith("\n")) {
    const position = monacoEditor.value.getPosition();
    code += "\n";
    monacoEditor.value.setValue(code);
    if (position) monacoEditor.value.setPosition(position);
  }
  userStore.saveCode(uuid, code);
}

function initializeEditor() {
  monacoEditor.value = monaco.editor.create(editorContainer.value!, {
    value: currentFile.value?.code,
    language:
      currentFile.value?.language === "TypeScript"
        ? "typescript"
        : "javascript",
    theme: "vs-dark",
  });

  // monaco.languages.registerHoverProvider("javascript", {
  //   provideHover: (model, position) => {
  //     const word = model.getWordAtPosition(position);
  //     if (!word) return null;

  //     const lineText = model.getLineContent(position.lineNumber);

  //     const consoleTooltip = insertConsoleTooltips(word.word, lineText);
  //     if (consoleTooltip) return consoleTooltip;

  //     const mathTooltip = insertMathTooltips(word.word, lineText);
  //     if (mathTooltip) return mathTooltip;
  //   },
  // });

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
const stopInitialWatcher = watch(
  [editorContainer, currentFile],
  () => {
    if (editorContainer.value && currentFile.value) {
      initializeEditor();
      stopInitialWatcher();
    }
  },
  { immediate: true }
);
</script>

<style scoped></style>

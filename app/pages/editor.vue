<template>
  <iframe
    ref="sandbox-frame"
    v-if="run"
    sandbox="allow-scripts"
    class="hidden absolute top-0 left-0"
    :srcdoc="iframeCode"
  ></iframe>

  <div class="w-full h-dvh flex flex-col items-center justify-center">
    <div class="w-full h-12 bg-neutral-700 shadow-lg">
      <!-- <img src="/bscode.svg" aria-hidden="true" class="size-8" /> -->
      <h1 class="text-white font-bold text-2xl">BS Code</h1>
    </div>

    <div class="w-full h-full flex items-center justify-center">
      <div ref="editor-container" class="w-full h-full"></div>

      <div
        class="w-125 h-full shrink-0 relative bg-neutral-800 flex flex-col items-center justify-center"
      >
        <div class="flex items-center justify-center gap-4 my-2">
          <button
            class="rounded-full shadow-lg bg-green-800 text-white cursor-pointer px-6 py-1"
          >
            Save
          </button>
          <button
            class="rounded-full shadow-lg bg-green-800 text-white cursor-pointer px-6 py-1"
            type="button"
            @click="runCode"
          >
            Save & Run
          </button>
        </div>

        <div
          class="w-full h-[calc(100dvh-6rem)] grow-0 p-2 console overflow-scroll"
        >
          <div v-for="log in bsConsole" class="py-1 px-2 text-white">
            >
            <span class="font-bold text-white"
              >[{{ log.timestamp.toLocaleTimeString() }}]</span
            >
            {{ log.message.slice(1, log.message.length - 1) }}
          </div>
        </div>
      </div>
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
let monacoEditor: editor.IStandaloneCodeEditor | undefined;

const run = ref(false);
const code = ref("");
const iframeCode = ref("");

const bsConsole = ref<Message[]>([]);

async function runCode() {
  run.value = false;
  await nextTick();

  saveCode();
  if (!monacoEditor) return;

  bsConsole.value = [new Message("log", "Starting execution...")];

  code.value = monacoEditor.getValue();
  iframeCode.value = `<head>
  <body>
    <script>
      const originalConsole = { log: console.log, warn: console.warn, error: console.error };

      const customConsole = (type) => (...args) => {
        parent.postMessage({
          type,
          message: args.map((arg) => JSON.stringify(arg)).join(" ")
        }, "*");

        originalConsole[type].apply(console, args);
      };

      window.console.log = customConsole("log");
      window.console.warn = customConsole("warn");
      window.console.error = customConsole("error");
    <\/script>

    <script>
      try {
        ${code.value}
      } catch (error) {
        console.error(String(error));
      }
    <\/script>
  </body>
</head>`;
  run.value = true;
}

async function saveCode() {
  if (!monacoEditor || currentFileIndex.value === undefined) return;

  let code = monacoEditor.getValue();
  if (!code.endsWith("\n")) {
    const position = monacoEditor.getPosition();
    code += "\n";
    monacoEditor.setValue(code);
    if (position) monacoEditor.setPosition(position);
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

watch(
  editorContainer,
  async (editor) => {
    monacoEditor = monaco.editor.create(editor!, {
      value: files.value[currentFileIndex.value ?? 0]?.code,
      language: "javascript",
      theme: "vs-dark",
    });
  },
  { once: true }
);

function catchConsole(event: MessageEvent) {
  if (event.source !== sandboxFrame.value?.contentWindow) return;

  const { type, message } = event.data as Message;
  bsConsole.value.push(new Message(type, message));
  console.log(bsConsole.value);
}
onMounted(() => window.addEventListener("message", catchConsole));
onUnmounted(() => window.removeEventListener("message", catchConsole));
</script>

<style scoped>
* {
  font-family: Comic Sans MS;
}

.console {
  scrollbar-width: none;
}
</style>

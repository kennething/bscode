<template>
  <div
    class="w-110 h-full shrink-0 relative bg-neutral-800 flex flex-col items-center justify-center"
  >
    <div class="flex items-center justify-center gap-4 my-2">
      <div class="du-tooltip du-tooltip-bottom" data-tip="ctrl + s">
        <button
          class="rounded-full shadow-lg bg-green-800 px-6 py-1 hover:bg-green-700 transition"
          :class="{ 'bg-green-700!': isSaving }"
          @click="emit('saveCode')"
        >
          Save
        </button>
      </div>
      <div class="du-tooltip du-tooltip-bottom" data-tip="ctrl + r">
        <button
          class="rounded-full shadow-lg bg-green-800 px-6 py-1 hover:bg-green-700 transition"
          :class="{ 'bg-green-700!': isRunning }"
          type="button"
          @click="runCode"
        >
          Save & Run
        </button>
      </div>
    </div>

    <div
      class="w-full h-[calc(100dvh-6rem)] grow-0 p-2 no-scrollbar overflow-scroll"
    >
      <div
        v-for="log in bsConsole"
        class="py-1 px-2 group/output my-1 rounded-lg transition relative"
        :class="{
          'hover:bg-neutral-700': log.type === 'log',
          'bg-yellow-500/25 hover:bg-yellow-500/40': log.type === 'warn',
          'bg-red-500/25 hover:bg-red-500/50': log.type === 'error',
        }"
      >
        :3
        <span class="font-bold"
          >[{{ log.timestamp.toLocaleTimeString() }}]</span
        >
        {{
          log.message.startsWith('"') && log.message.endsWith('"')
            ? log.message.slice(1, log.message.length - 1)
            : log.message
        }}
        {{ console.log(log.message) }}

        <div
          class="absolute -top-2 right-2 du-tooltip shadow-lg transition du-tooltip-left group-hover/output:opacity-100 opacity-0 pointer-events-none group-hover/output:pointer-events-auto"
          :data-tip="
            log.wasCopied
              ? 'Copied!'
              : `Copy ${log.type === 'log' ? 'output' : log.type === 'warn' ? 'warning' : 'error'}`
          "
        >
          <button
            class="du-swap p-0.5 rounded bg-neutral-600 hover:bg-neutral-600 transition"
            :class="{ 'du-swap-active': log.wasCopied }"
            type="button"
            @click="copyOutput(log)"
          >
            <img
              class="du-swap-off size-4 invert"
              src="/copy-outline.svg"
              alt="Click to copy console output to clipbard"
            />
            <img
              class="du-swap-on size-4 invert"
              src="/checkmark-outline.svg"
              alt="Console output copied to clipbard!"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { editor } from "monaco-editor";

const props = defineProps<{
  currentFile: CodeFile | undefined;
  sandboxFrame: HTMLIFrameElement | null;
  editor: editor.IStandaloneCodeEditor | undefined;
}>();
const emit = defineEmits<{
  updateIframeCode: [string];
  saveCode: [void];
}>();
const runModel = defineModel<boolean>({ default: false });

const bsConsole = ref<Message[]>([]);

async function runCode() {
  runModel.value = false;
  await nextTick();

  emit("saveCode");
  if (!props.editor || !props.currentFile) return;

  bsConsole.value = [new Message("log", '"Starting execution..."')];

  let code = props.editor.getValue();
  if (props.currentFile.language === "TypeScript")
    code = (
      await $fetch("/api/transpileTs", {
        method: "POST",
        body: { code },
      })
    ).code;

  emit(
    "updateIframeCode",
    `<head>
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
        ${code}
      } catch (error) {
        console.error(String(error));
      }
    <\/script>
  </body>
</head>`
  );
  runModel.value = true;
}

function catchConsole(event: MessageEvent) {
  if (event.source !== props.sandboxFrame?.contentWindow) return;

  const { type, message } = event.data as Message;
  const parsedMessage =
    message.startsWith('"') && message.endsWith('"')
      ? message.slice(1, message.length - 1)
      : message;
  bsConsole.value.push(new Message(type, parsedMessage));
}
onMounted(() => window.addEventListener("message", catchConsole));
onUnmounted(() => window.removeEventListener("message", catchConsole));

const isSaving = ref(false);
const isRunning = ref(false);
function handleHotkeys(event: KeyboardEvent) {
  if (event.ctrlKey) {
    if (event.key === "s") {
      event.preventDefault();
      isSaving.value = true;
      setTimeout(() => (isSaving.value = false), 150);
      emit("saveCode");
      return;
    }
    if (event.key === "r") {
      event.preventDefault();
      isRunning.value = true;
      setTimeout(() => (isRunning.value = false), 150);
      runCode();
      return;
    }
  }
}
onMounted(() => window.addEventListener("keypress", handleHotkeys));
onUnmounted(() => window.removeEventListener("keypress", handleHotkeys));

function copyOutput(log: Message) {
  navigator.clipboard.writeText(log.message);
  log.wasCopied = true;
  setTimeout(() => (log.wasCopied = false), 2000);
}
</script>

<style scoped></style>

<template>
  <div
    class="w-110 h-full shrink-0 relative bg-neutral-800 flex flex-col items-center justify-center"
  >
    <div class="flex items-center justify-center gap-4 my-2">
      <button
        class="rounded-full shadow-lg bg-green-800 px-6 py-1"
        @click="emit('saveCode')"
      >
        Save
      </button>
      <button
        class="rounded-full shadow-lg bg-green-800 px-6 py-1"
        type="button"
        @click="runCode"
      >
        Save & Run
      </button>
    </div>

    <div
      class="w-full h-[calc(100dvh-6rem)] grow-0 p-2 no-scrollbar overflow-scroll"
    >
      <div v-for="log in bsConsole" class="py-1 px-2">
        >
        <span class="font-bold"
          >[{{ log.timestamp.toLocaleTimeString() }}]</span
        >
        {{ log.message.slice(1, log.message.length - 1) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { editor } from "monaco-editor";

const props = defineProps<{
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
  if (!props.editor) return;

  bsConsole.value = [new Message("log", '"Starting execution..."')];

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
        ${props.editor.getValue()}
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
  bsConsole.value.push(new Message(type, message));
}
onMounted(() => window.addEventListener("message", catchConsole));
onUnmounted(() => window.removeEventListener("message", catchConsole));
</script>

<style scoped></style>

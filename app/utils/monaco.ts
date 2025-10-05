import * as monaco from "monaco-editor";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "typescript" || label === "javascript")
      return new Worker(
        new URL(
          "@/../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker?worker",
          import.meta.url
        ),
        { type: "module" }
      );

    return new Worker(
      new URL(
        "@/../node_modules/monaco-editor/esm/vs/editor/editor.worker?worker",
        import.meta.url
      ),
      { type: "module" }
    );
  },
};

export default monaco;

import esbuild from "esbuild";

type Body = {
  code: string;
};

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Body;

  const result = esbuild.transformSync(body.code, {
    loader: "ts",
    format: "esm",
    target: ["ESNext"],
  });

  return result;
});

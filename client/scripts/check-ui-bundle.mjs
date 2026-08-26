import { readdir, readFile } from "node:fs/promises";

const assetDir = new URL("../dist/assets/", import.meta.url);
const entry = (await readdir(assetDir)).find((file) => file.endsWith(".js"));
if (!entry) throw new Error("Built UI bundle not found");

const bundle = await readFile(new URL(entry, assetDir), "utf8");
if (bundle.includes("React.createElement") && !bundle.includes("React=")) {
  throw new Error("UI bundle references an undefined React runtime");
}

console.log("UI bundle runtime check passed");

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const ts = require("typescript");

const rootDir = path.resolve(__dirname, "..");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveTypeScriptImports(request, parent, isMain, options) {
  if (request.startsWith(".") && parent?.filename) {
    const resolved = path.resolve(path.dirname(parent.filename), request);

    if (!path.extname(resolved) && fs.existsSync(`${resolved}.ts`)) {
      return `${resolved}.ts`;
    }
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  });

  module._compile(output.outputText, filename);
};

const { sampleTemplate } = require(path.join(rootDir, "lib/templater/sample-template.ts"));
const { createNextProjectFiles } = require(path.join(rootDir, "lib/templater/next-project-export.ts"));
const { createStaticStorefrontFiles } = require(path.join(rootDir, "lib/templater/static-export.ts"));

const projectName = "atelier-minimal";
const nextFiles = createNextProjectFiles(sampleTemplate);
const staticFiles = createStaticStorefrontFiles(sampleTemplate);

assertFiles(
  nextFiles,
  [
    `${projectName}/package.json`,
    `${projectName}/next.config.ts`,
    `${projectName}/tsconfig.json`,
    `${projectName}/app/layout.tsx`,
    `${projectName}/app/page.tsx`,
    `${projectName}/app/collection/page.tsx`,
    `${projectName}/app/product/page.tsx`,
    `${projectName}/app/cart/page.tsx`,
    `${projectName}/app/checkout/page.tsx`,
    `${projectName}/components/storefront.tsx`,
    `${projectName}/data/template.ts`,
    `${projectName}/app/globals.css`,
  ],
  "Next project export",
);

assertIncludes(nextFiles, `${projectName}/package.json`, ['"dev": "next dev"', '"build": "next build"', '"next": "16.2.6"']);
assertIncludes(nextFiles, `${projectName}/components/storefront.tsx`, ["StorefrontProvider", "StorefrontApp", "Cart {cartCount}", "Add to cart"]);
assertIncludes(nextFiles, `${projectName}/data/template.ts`, ["Atelier Minimal", "linen-shirt"]);

assertFiles(staticFiles, ["index.html", "assets/storefront.css", "template-data.json"], "Static storefront export");
assertIncludes(staticFiles, "index.html", ['<link rel="stylesheet" href="assets/storefront.css" />', "store-template-data"]);

console.log(`Export verification passed: ${nextFiles.length} Next app files, ${staticFiles.length} static site files.`);

function assertFiles(files, expectedPaths, label) {
  const paths = new Set(files.map((file) => file.path));
  const missing = expectedPaths.filter((expectedPath) => !paths.has(expectedPath));

  if (missing.length > 0) {
    throw new Error(`${label} missing files: ${missing.join(", ")}`);
  }
}

function assertIncludes(files, filePath, snippets) {
  const file = files.find((candidate) => candidate.path === filePath);

  if (!file) {
    throw new Error(`Missing file for content assertion: ${filePath}`);
  }

  const missing = snippets.filter((snippet) => !file.content.includes(snippet));

  if (missing.length > 0) {
    throw new Error(`${filePath} missing content: ${missing.join(", ")}`);
  }
}

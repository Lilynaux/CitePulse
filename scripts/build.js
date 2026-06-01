const { build, context } = require("esbuild");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const args = new Set(process.argv.slice(2));
const isWatch = args.has("--watch");
const isPackage = args.has("--package");

const buildOptions = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  outfile: "addon/content/main.js",
  format: "iife",
  platform: "browser",
  target: ["firefox102"],
  logLevel: "info",
};

async function run() {
  if (isWatch) {
    const ctx = await context(buildOptions);
    await ctx.watch();
    console.log("Watching for changes... (Ctrl+C to stop)");
    return;
  }

  await build(buildOptions);
  console.log("Build complete.");

  if (isPackage) {
    packageXPI();
  }
}

function packageXPI() {
  const outDir = "build";
  const xpiName = "CitePulse.xpi";
  const xpiPath = path.join(outDir, xpiName);

  fs.mkdirSync(outDir, { recursive: true });

  if (fs.existsSync(xpiPath)) fs.rmSync(xpiPath);

  execSync(`cd addon && zip -r "../${xpiPath}" .`, { stdio: "inherit" });
  console.log(`Packaged: ${xpiPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

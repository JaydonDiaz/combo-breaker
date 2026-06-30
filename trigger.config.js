import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "proj_dgscnpanifzyhwaiyikh",
  dirs: ["./src/trigger"],
  runtime: "node",
  logLevel: "log",
  maxDuration: 120,
  machine: "small-1x",
  retries: {
    enabledInDev: false,
    default: { maxAttempts: 2, minTimeoutInMs: 2000, maxTimeoutInMs: 10000, factor: 2 },
  },
  build: {
    external: ["@react-pdf/renderer", "@composio/core"],
    autoDetectExternal: true,
  },
});

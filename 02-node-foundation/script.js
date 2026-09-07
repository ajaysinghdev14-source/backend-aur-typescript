const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { log } = require("node:console");

console.log('NodeJS: ', process.versions.node);
console.log('V8: ', process.versions.v8);
console.log('Libuv: ', process.versions.uv);
console.log('============================================');
console.log('plateform: ', process.platform);
console.log('cpu: ', os.cpus().length);

console.log(typeof global);
console.log(typeof globalThis);
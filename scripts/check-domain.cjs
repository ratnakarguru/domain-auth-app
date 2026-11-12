const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const source = readFileSync(join(__dirname, "../src/utils/domainValidator.ts"), "utf8");
assert.match(source, /const DEVELOPMENT_MODE = true;/);
assert.match(source, /const DEVELOPMENT_EMAIL = "ratnakarguru16@gmail.com";/);
assert.match(source, /const ALLOWED_DOMAIN = "hbplus.fit";/);

function validator(developmentMode) {
  const code = ts.transpileModule(
    source.replace("const DEVELOPMENT_MODE = true;", `const DEVELOPMENT_MODE = ${developmentMode};`),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } }
  ).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports });
  return exports.isAllowedDomain;
}

const development = validator(true);
assert.equal(development("ratnakarguru16@gmail.com"), true);
assert.equal(development("another@gmail.com"), false);
assert.equal(development("example@hbplus.fit"), false);

const strict = validator(false);
assert.equal(strict("example@hbplus.fit"), true);
for (const email of ["example@gmail.com", "example@other.com", "example@fakehbplus.fit"]) {
  assert.equal(strict(email), false);
}

console.log("Domain validation passed in both modes.");

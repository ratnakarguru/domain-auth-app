const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const source = readFileSync(join(__dirname, "../src/utils/domainValidator.ts"), "utf8");
assert.match(source, /const ALLOWED_DOMAIN = "hbplus.fit";/);
assert.doesNotMatch(source, /DEVELOPMENT_MODE|DEVELOPMENT_EMAIL/);

const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const moduleExports = {};
vm.runInNewContext(code, { exports: moduleExports });
const { isAllowedDomain, DOMAIN_ERROR } = moduleExports;

assert.equal(DOMAIN_ERROR, "Access restricted. Please login using your official domain email.");

for (const email of ["employee@hbplus.fit", "Employee@HBPLUS.FIT", " employee@hbplus.fit "]) {
  assert.equal(isAllowedDomain(email), true, `${email} should be allowed`);
}

for (const email of [
  "ratnakarguru16@gmail.com",
  "person@gmail.com",
  "person@hbplus.fit.evil.com",
  "person@evil-hbplus.fit",
  "person@other.com",
  "person@fakehbplus.fit",
  "",
  "   ",
  "@hbplus.fit",
  "person@@hbplus.fit",
  "person@hbplus.fit@evil.com",
  "person @hbplus.fit",
]) {
  assert.equal(isAllowedDomain(email), false, `${email} should be rejected`);
}

const authSource = readFileSync(join(__dirname, "../src/services/authService.ts"), "utf8");
const authCode = ts.transpileModule(authSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const authExports = {};
let signedInUser;
let firebaseSignOuts = 0;
let googleSignOuts = 0;

vm.runInNewContext(authCode, {
  exports: authExports,
  console,
  require: (name) => {
    if (name === "firebase/auth") return { signOut: async () => { firebaseSignOuts++; } };
    if (name === "../config/firebase") return { auth: {} };
    if (name === "../utils/domainValidator") return { DOMAIN_ERROR, isAllowedDomain };
    if (name === "./googleSignIn") return {
      signInWithGoogle: async () => ({ user: signedInUser }),
      clearGoogleSession: async () => { googleSignOuts++; },
    };
    throw new Error(`Unexpected import: ${name}`);
  },
});

async function checkAuthService() {
  signedInUser = { email: "employee@hbplus.fit", emailVerified: true };
  await authExports.loginWithGoogle();
  assert.equal(firebaseSignOuts, 0);
  assert.equal(googleSignOuts, 0);

  for (const [user, message] of [
    [{ email: "person@gmail.com", emailVerified: true }, DOMAIN_ERROR],
    [{ email: "employee@hbplus.fit", emailVerified: false }, "Google email could not be verified."],
  ]) {
    signedInUser = user;
    await assert.rejects(authExports.loginWithGoogle(), (error) => error.message === message);
  }
  assert.equal(firebaseSignOuts, 2);
  assert.equal(googleSignOuts, 2);
  console.log("Strict domain and mocked sign-in cleanup checks passed (3 allowed, 12 rejected).");
}

checkAuthService().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

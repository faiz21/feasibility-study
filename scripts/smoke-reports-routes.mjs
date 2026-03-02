const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const authCookie = process.env.AUTH_COOKIE ?? "";
const reportTypeId = process.env.REPORT_TYPE_ID ?? "";
const reportId = process.env.REPORT_ID ?? "";

const failures = [];

function fail(message) {
  failures.push(message);
}

function normalizeLocation(value) {
  if (!value) return "";
  try {
    return new URL(value, baseUrl).pathname;
  } catch {
    return value;
  }
}

async function request(pathname, cookie = "") {
  const response = await fetch(new URL(pathname, baseUrl), {
    method: "GET",
    redirect: "manual",
    headers: cookie ? { cookie } : undefined,
  });

  return {
    status: response.status,
    location: normalizeLocation(response.headers.get("location")),
  };
}

function assertRedirectToLogin(label, result) {
  const isRedirect = result.status >= 300 && result.status < 400;
  if (!isRedirect) {
    fail(`${label}: expected redirect, got status ${result.status}`);
    return;
  }
  if (!result.location.startsWith("/login")) {
    fail(`${label}: expected redirect to /login, got ${result.location || "(empty location)"}`);
  }
}

function assertNonServerError(label, result) {
  if (result.status >= 500) {
    fail(`${label}: server error status ${result.status}`);
  }
}

async function runUnauthenticatedChecks() {
  const paths = ["/reports", "/reports/smoke-type", "/reports/smoke-type/smoke-report"];

  for (const pathname of paths) {
    const result = await request(pathname);
    assertRedirectToLogin(`Unauth ${pathname}`, result);
  }
}

async function runAuthenticatedChecks() {
  if (!authCookie) {
    console.log("ℹ Skipping authenticated checks (set AUTH_COOKIE to enable).");
    return;
  }

  const landing = await request("/reports", authCookie);
  assertNonServerError("Auth /reports", landing);

  if (reportTypeId) {
    const byType = await request(`/reports/${reportTypeId}`, authCookie);
    assertNonServerError(`Auth /reports/${reportTypeId}`, byType);
  } else {
    console.log("ℹ Skipping /reports/[typeId] auth check (set REPORT_TYPE_ID).");
  }

  if (reportTypeId && reportId) {
    const reader = await request(`/reports/${reportTypeId}/${reportId}`, authCookie);
    assertNonServerError(`Auth /reports/${reportTypeId}/${reportId}`, reader);
  } else {
    console.log("ℹ Skipping /reports/[typeId]/[reportId] auth check (set REPORT_TYPE_ID and REPORT_ID).");
  }
}

async function main() {
  console.log(`Running reports smoke checks against ${baseUrl}`);
  await runUnauthenticatedChecks();
  await runAuthenticatedChecks();

  if (failures.length) {
    console.error("\nSmoke checks failed:");
    for (const message of failures) {
      console.error(`- ${message}`);
    }
    process.exit(1);
  }

  console.log("✅ Reports route smoke checks passed.");
}

main().catch((error) => {
  console.error("Smoke checks crashed:", error?.message ?? error);
  process.exit(1);
});

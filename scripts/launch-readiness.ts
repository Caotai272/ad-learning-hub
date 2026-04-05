import "dotenv/config";

import { getSystemHealthSnapshot } from "../src/server/health";

async function main() {
  const snapshot = await getSystemHealthSnapshot();

  console.log("Launch readiness snapshot");
  console.log(`Status: ${snapshot.status}`);
  console.log(`Phase: ${snapshot.phase}`);
  console.log(`Service: ${snapshot.service}`);
  console.log("");

  for (const check of snapshot.launch.checks) {
    console.log(`${check.passed ? "[PASS]" : "[FAIL]"} ${check.label}`);
    console.log(`  ${check.detail}`);
  }

  console.log("");
  console.log("Inventory");
  console.log(JSON.stringify(snapshot.inventory, null, 2));

  if (!snapshot.launch.ready) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

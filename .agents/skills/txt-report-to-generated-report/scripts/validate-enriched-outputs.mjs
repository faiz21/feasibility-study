import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = { schemasDir: "", runDir: "" };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--schemas-dir") out.schemasDir = argv[++i] ?? "";
    else if (a === "--run-dir") out.runDir = argv[++i] ?? "";
  }
  return out;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function loadAjv() {
  // Prefer Ajv v8 (draft 2020) when available.
  const candidates = [
    "ajv/dist/2020.js",
    "ajv/dist/2020",
    // Ajv v8 is commonly nested under build tooling deps.
    "schema-utils/node_modules/ajv/dist/2020.js",
    "schema-utils/node_modules/ajv/dist/2020",
    "next/dist/compiled/ajv/dist/2020.js",
    "next/dist/compiled/ajv/dist/2020",
    "ajv",
  ];

  for (const spec of candidates) {
    try {
      const mod = await import(spec);
      return mod.default ?? mod;
    } catch {
      continue;
    }
  }

  return null;
}

function listStepSchemas(schemasDir) {
  return fs
    .readdirSync(schemasDir)
    .filter((name) => /^plant-report-generator-\d{2}-enriched\.schema\.json$/i.test(name))
    .sort();
}

function main() {
  const { schemasDir, runDir } = parseArgs(process.argv);
  if (!schemasDir || !runDir) {
    console.error(
      'Usage: node validate-enriched-outputs.mjs --schemas-dir "report/Report Generator" --run-dir "<runDir>"',
    );
    process.exit(2);
  }

  const absSchemas = path.resolve(process.cwd(), schemasDir);
  const absRun = path.resolve(process.cwd(), runDir);

  const baseSchemaPath = path.join(absSchemas, "plant-report-generator-enriched-base.schema.json");
  if (!fs.existsSync(baseSchemaPath)) {
    console.error(`Base schema not found: ${baseSchemaPath}`);
    process.exit(2);
  }

  const stepSchemas = listStepSchemas(absSchemas);
  if (!stepSchemas.length) {
    console.error(`No step schemas found in: ${absSchemas}`);
    process.exit(2);
  }

  const run = async () => {
    const AjvCtor = await loadAjv();
    if (!AjvCtor) {
      console.error('Ajv is not available. Install it with: npm i -D ajv ajv-formats');
      process.exit(2);
    }

    const ajv = new AjvCtor({
      allErrors: true,
      strict: false,
      allowUnionTypes: true,
      // Avoid failing due to unavailable metaschemas when Ajv is older/nested.
      validateSchema: false,
    });

    const baseSchema = readJson(baseSchemaPath);
    // Step schemas reference "./plant-report-generator-enriched-base.schema.json" relative to their $id.
    // Add an alias $id that matches the resolved URL Ajv will compute.
    const baseAlias = JSON.parse(JSON.stringify(baseSchema));
    baseAlias.$id =
      "https://mv-project.local/schemas/plant-report-generator/plant-report-generator-enriched-base.schema.json";

    // Avoid forcing meta-schema resolution from "$schema" fields.
    delete baseSchema.$schema;
    delete baseAlias.$schema;
    ajv.addSchema(baseSchema);
    ajv.addSchema(baseAlias);

    const failures = [];

    for (const schemaFile of stepSchemas) {
      const match = /^plant-report-generator-(\d{2})-enriched\.schema\.json$/i.exec(schemaFile);
      const step = match?.[1] ?? "";
      const stepSchemaPath = path.join(absSchemas, schemaFile);
      const outputPath = path.join(absRun, `step-${step}.enriched.json`);

      if (!fs.existsSync(outputPath)) {
        failures.push(`Missing output for step ${step}: ${outputPath}`);
        continue;
      }

      const schema = readJson(stepSchemaPath);
      delete schema.$schema;
      ajv.addSchema(schema);

      const validate = ajv.getSchema(schema.$id) ?? ajv.compile(schema);
      const data = readJson(outputPath);
      const ok = validate(data);

      if (!ok) {
        const errs = (validate.errors ?? []).map((e) => `${e.instancePath || "/"} ${e.message ?? ""}`.trim());
        failures.push(`Step ${step} invalid:\n  - ${errs.join("\n  - ")}`);
      }
    }

    if (failures.length) {
      console.error("Validation failed:");
      for (const f of failures) console.error(`- ${f}`);
      process.exit(1);
    }

    console.log("All enriched step outputs validate.");
  };

  run().catch((err) => {
    console.error("Validation crashed:", err?.message ?? err);
    process.exit(1);
  });
}

main();

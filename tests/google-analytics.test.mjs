import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

const measurementId = "G-PE695ZZE0F";

test("index.html includes the Google Analytics tag", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(
    html,
    new RegExp(
      `<script\\s+async\\s+src="https://www\\.googletagmanager\\.com/gtag/js\\?id=${measurementId}"></script>`
    )
  );
  assert.match(html, new RegExp(`gtag\\('config', '${measurementId}'\\);`));
});

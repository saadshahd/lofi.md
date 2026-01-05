const assert = require("node:assert");
const vscode = require("vscode");
const path = require("node:path");
const fs = require("node:fs");

describe("lofi Extension Test Suite", function () {
  this.timeout(10000);

  it("should register lofi language", async () => {
    const langs = await vscode.languages.getLanguages();
    assert.ok(langs.includes("lofi"), "lofi language should be registered");
  });

  it("should activate on .lofi file", async () => {
    const testFile = path.join(__dirname, "..", "..", "test.lofi");
    fs.writeFileSync(testFile, 'card\n  heading "Test"');

    try {
      const doc = await vscode.workspace.openTextDocument(testFile);
      await vscode.window.showTextDocument(doc);

      assert.strictEqual(
        doc.languageId,
        "lofi",
        "Document should be lofi language",
      );
    } finally {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
    }
  });

  it("should have extension present", async () => {
    const ext = vscode.extensions.all.find((e) => e.id.includes("lofi"));
    assert.ok(ext, "lofi extension should be present in extensions list");
    assert.strictEqual(ext.id, "lofi.lofi-wireframes");
  });

  it("should activate and register commands", async () => {
    const ext = vscode.extensions.getExtension("lofi.lofi-wireframes");
    assert.ok(ext, "Extension should exist");

    await ext.activate();
    assert.ok(ext.isActive, "Extension should be active");

    const commands = await vscode.commands.getCommands(true);
    assert.ok(
      commands.includes("lofi.preview.open"),
      "lofi.preview.open command should exist after activation",
    );
  });
});

import { describe, it, expect } from "vitest";
import { generate } from "./index.js";
import { parse } from "@lofi/language";

describe("generate()", () => {
  describe("containers", () => {
    it("renders page with title", async () => {
      const doc = await parse('page "My Page"');
      const html = generate(doc);
      expect(html).toContain("<div");
      expect(html).toContain("min-h-screen");
      expect(html).toContain("My Page");
    });

    it("renders card", async () => {
      const doc = await parse("card");
      const html = generate(doc);
      expect(html).toContain("<div");
      expect(html).toContain("rounded-lofi");
      expect(html).toContain("border");
      expect(html).toContain("wobble");
    });

    it("renders nested card with children", async () => {
      const doc = await parse('card\n  heading "Title"\n  text "Body"');
      const html = generate(doc);
      expect(html).toContain("<div");
      expect(html).toContain("<h1");
      expect(html).toContain("<p");
      expect(html).toContain("Title");
      expect(html).toContain("Body");
    });

    it("renders grid with attributes", async () => {
      const doc = await parse('grid cols="3" gap="4" justify="between"');
      const html = generate(doc);
      expect(html).toContain("grid-cols-3");
      expect(html).toContain("gap-4");
      expect(html).toContain("justify-between");
    });

    it("renders form", async () => {
      const doc = await parse('form\n  input "Email"');
      const html = generate(doc);
      expect(html).toContain("<form");
      expect(html).toContain("<input");
    });

    it("renders alert with type", async () => {
      const doc = await parse('alert type="error"\n  text "Error message"');
      const html = generate(doc);
      expect(html).toContain('role="alert"');
      expect(html).toContain("border-lofi-error");
      expect(html).toContain("bg-lofi-muted");
      expect(html).toContain("Error message");
    });

    it("renders hidden alert", async () => {
      const doc = await parse("alert hidden=1");
      const html = generate(doc);
      expect(html).toContain("hidden");
    });
  });

  describe("controls", () => {
    it("renders button with primary variant", async () => {
      const doc = await parse('button "Save" primary=1');
      const html = generate(doc);
      expect(html).toContain("<button");
      expect(html).toContain("bg-lofi");
      expect(html).toContain("text-lofi-bg");
      expect(html).toContain("Save");
      expect(html).toContain("wobble");
    });

    it("renders disabled button", async () => {
      const doc = await parse('button "Save" disabled=1');
      const html = generate(doc);
      expect(html).toContain("disabled");
      expect(html).toContain("opacity-50");
      expect(html).toContain("cursor-not-allowed");
    });

    it("renders input with label and placeholder", async () => {
      const doc = await parse(
        'input "Email" type="email" placeholder="you@example.com"',
      );
      const html = generate(doc);
      expect(html).toContain("<input");
      expect(html).toContain('type="email"');
      expect(html).toContain("Email");
      expect(html).toContain("you@example.com");
    });

    it("renders input with error state", async () => {
      const doc = await parse('input "Username" error=1');
      const html = generate(doc);
      expect(html).toContain("border-lofi-error");
    });

    it("renders checkbox", async () => {
      const doc = await parse('checkbox "Remember me" checked=1');
      const html = generate(doc);
      expect(html).toContain('type="checkbox"');
      expect(html).toContain("checked");
      expect(html).toContain("Remember me");
    });

    it("renders radio buttons with name", async () => {
      const doc = await parse('radio "Option A" name="choices" selected=1');
      const html = generate(doc);
      expect(html).toContain('type="radio"');
      expect(html).toContain('name="choices"');
      expect(html).toContain("checked");
    });

    it("renders dropdown with options", async () => {
      const doc = await parse(
        'dropdown "Country" options="USA,UK,Canada" placeholder="Select"',
      );
      const html = generate(doc);
      expect(html).toContain("<select");
      expect(html).toContain("<option");
      expect(html).toContain("USA");
      expect(html).toContain("UK");
      expect(html).toContain("Canada");
      expect(html).toContain("Select");
    });

    it("renders link", async () => {
      const doc = await parse('link "Click here" href="/page" active=1');
      const html = generate(doc);
      expect(html).toContain("<a");
      expect(html).toContain('href="/page"');
      expect(html).toContain("Click here");
      expect(html).toContain("font-medium");
    });

    it("renders toggle", async () => {
      const doc = await parse('toggle "Dark mode" checked=1');
      const html = generate(doc);
      expect(html).toContain('role="switch"');
      expect(html).toContain('aria-checked="true"');
      expect(html).toContain("Dark mode");
    });

    it("renders slider", async () => {
      const doc = await parse('slider "Volume" min="0" max="100" value="75"');
      const html = generate(doc);
      expect(html).toContain('type="range"');
      expect(html).toContain('min="0"');
      expect(html).toContain('max="100"');
      expect(html).toContain('value="75"');
    });
  });

  describe("content", () => {
    it("renders heading with level", async () => {
      const doc = await parse('heading "Title" level="2"');
      const html = generate(doc);
      expect(html).toContain("<h2");
      expect(html).toContain("</h2>");
      expect(html).toContain("Title");
      expect(html).toContain("text-3xl");
    });

    it("renders muted text", async () => {
      const doc = await parse('text "Subtle text" muted=1');
      const html = generate(doc);
      expect(html).toContain("<p");
      expect(html).toContain("text-lofi-muted");
      expect(html).toContain("Subtle text");
    });

    it("renders image", async () => {
      const doc = await parse('image src="/photo.jpg" alt="Photo"');
      const html = generate(doc);
      expect(html).toContain("<img");
      expect(html).toContain('src="/photo.jpg"');
      expect(html).toContain('alt="Photo"');
    });

    it("renders badge with type", async () => {
      const doc = await parse('badge "New" type="success"');
      const html = generate(doc);
      expect(html).toContain("<span");
      expect(html).toContain("bg-lofi-muted");
      expect(html).toContain("text-lofi-success");
      expect(html).toContain("New");
    });

    it("renders avatar with initials", async () => {
      const doc = await parse('avatar alt="John Doe"');
      const html = generate(doc);
      expect(html).toContain("JD");
      expect(html).toContain("rounded-full");
    });

    it("renders progress bar", async () => {
      const doc = await parse('progress value="75"');
      const html = generate(doc);
      expect(html).toContain('role="progressbar"');
      expect(html).toContain('aria-valuenow="75"');
      expect(html).toContain('style="width: 75%"');
    });

    it("renders chart placeholder", async () => {
      const doc = await parse('chart "Sales" type="bar"');
      const html = generate(doc);
      expect(html).toContain('data-chart-type="bar"');
      expect(html).toContain("Sales");
    });
  });

  describe("blocks", () => {
    it("converts markdown blocks to HTML", async () => {
      const doc = await parse("card\n  md\n    **bold** text");
      const html = generate(doc);
      expect(html).toContain("<strong>bold</strong>");
      expect(html).toContain('class="lofi-md"');
    });

    it("renders markdown tables", async () => {
      const doc = await parse(
        "card\n  md\n    | A | B |\n    |---|---|\n    | 1 | 2 |",
      );
      const html = generate(doc);
      expect(html).toContain("<table");
      expect(html).toContain("<th");
      expect(html).toContain("<td");
    });

    it("passes through HTML blocks raw", async () => {
      const doc = await parse('card\n  html\n    <video src="x.mp4"></video>');
      const html = generate(doc);
      expect(html).toContain('<video src="x.mp4"></video>');
    });
  });

  describe("integration", () => {
    it("renders complete form", async () => {
      const lofi = `card
  heading "Login"
  form
    input "Email" type="email" required=1
    input "Password" type="password" required=1
    button "Sign In" primary=1`;
      const doc = await parse(lofi);
      const html = generate(doc);
      expect(html).toContain("Login");
      expect(html).toContain('type="email"');
      expect(html).toContain('type="password"');
      expect(html).toContain("Sign In");
      expect(html).toContain("bg-lofi");
      expect(html).toContain("font-sketch");
    });
  });
});

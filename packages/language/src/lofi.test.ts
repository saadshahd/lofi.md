import { describe, it, expect } from "vitest";
import { parse, isElement, isMdBlock, isHtmlBlock } from "./index.js";

describe("lofi grammar", () => {
  describe("basic parsing", () => {
    it("parses a single element", async () => {
      const doc = await parse("card");
      expect(doc.elements).toHaveLength(1);
      const el = doc.elements[0];
      expect(isElement(el)).toBe(true);
      if (isElement(el)) {
        expect(el.keyword).toBe("card");
      }
    });

    it("parses element with content", async () => {
      const doc = await parse('heading "Hello World"');
      const el = doc.elements[0];
      if (isElement(el)) {
        expect(el.keyword).toBe("heading");
        expect(el.content).toBe("Hello World");
      }
    });

    it("parses element with boolean attribute", async () => {
      const doc = await parse('button "Save" primary=1');
      const el = doc.elements[0];
      if (isElement(el)) {
        expect(el.keyword).toBe("button");
        expect(el.content).toBe("Save");
        expect(el.attrs).toHaveLength(1);
        expect(el.attrs[0].name).toBe("primary");
        expect(el.attrs[0].value).toBe("1");
      }
    });

    it("parses element with key=value attribute", async () => {
      const doc = await parse('heading "Title" level=2');
      const el = doc.elements[0];
      if (isElement(el)) {
        expect(el.attrs[0].name).toBe("level");
        expect(el.attrs[0].value).toBe("2");
      }
    });
  });

  describe("indentation / nesting", () => {
    it("parses nested children with 2-space indent", async () => {
      const input = `card
  heading "Title"
  text "Content"`;
      const doc = await parse(input);

      expect(doc.elements).toHaveLength(1);
      const card = doc.elements[0];
      if (isElement(card)) {
        expect(card.keyword).toBe("card");
        expect(card.children).toHaveLength(2);
        const child0 = card.children[0];
        const child1 = card.children[1];
        if (isElement(child0) && isElement(child1)) {
          expect(child0.keyword).toBe("heading");
          expect(child1.keyword).toBe("text");
        }
      }
    });

    it("parses deeply nested structure", async () => {
      const input = `card
  grid
    button "Save"`;
      const doc = await parse(input);

      const card = doc.elements[0];
      if (isElement(card)) {
        expect(card.children).toHaveLength(1);
        const grid = card.children[0];
        if (isElement(grid)) {
          expect(grid.keyword).toBe("grid");
          expect(grid.children).toHaveLength(1);
          const btn = grid.children[0];
          if (isElement(btn)) {
            expect(btn.keyword).toBe("button");
          }
        }
      }
    });

    it("parses siblings at same level", async () => {
      const input = `card
  heading "A"
card
  heading "B"`;
      const doc = await parse(input);

      expect(doc.elements).toHaveLength(2);
      const el0 = doc.elements[0];
      const el1 = doc.elements[1];
      if (isElement(el0) && isElement(el1)) {
        const child0 = el0.children[0];
        const child1 = el1.children[0];
        if (isElement(child0) && isElement(child1)) {
          expect(child0.content).toBe("A");
          expect(child1.content).toBe("B");
        }
      }
    });
  });

  describe("comments", () => {
    it("ignores comment lines", async () => {
      const input = `# This is a comment
card
  # Another comment
  heading "Title"`;
      const doc = await parse(input);

      expect(doc.elements).toHaveLength(1);
      const el = doc.elements[0];
      if (isElement(el)) {
        expect(el.children).toHaveLength(1);
      }
    });
  });

  describe("all 31 keywords", () => {
    const containerKeywords = [
      "page",
      "section",
      "card",
      "grid",
      "modal",
      "nav",
      "tabs",
      "menu",
      "form",
      "alert",
      "breadcrumb",
    ];
    const controlKeywords = [
      "button",
      "input",
      "checkbox",
      "radio",
      "dropdown",
      "textarea",
      "link",
      "tab",
      "accordion",
      "toggle",
      "slider",
    ];
    const contentKeywords = [
      "heading",
      "text",
      "image",
      "icon",
      "badge",
      "toast",
      "avatar",
      "progress",
      "chart",
    ];

    for (const kw of [
      ...containerKeywords,
      ...controlKeywords,
      ...contentKeywords,
    ]) {
      it(`parses ${kw}`, async () => {
        const doc = await parse(kw);
        const el = doc.elements[0];
        if (isElement(el)) {
          expect(el.keyword).toBe(kw);
        }
      });
    }
  });

  describe("md blocks", () => {
    it("parses md block form", async () => {
      const input = `md
  Welcome, **user**!`;
      const doc = await parse(input);
      expect(doc.elements).toHaveLength(1);
      const block = doc.elements[0];
      expect(isMdBlock(block)).toBe(true);
      if (isMdBlock(block)) {
        expect(block.lines).toHaveLength(1);
        expect(block.lines[0]).toBe("Welcome, **user**!");
      }
    });

    it("parses md block with table", async () => {
      const input = `card
  md
    | Name | Value |
    |------|-------|
    | Test | 123   |`;
      const doc = await parse(input);
      const card = doc.elements[0];
      if (isElement(card)) {
        expect(card.children).toHaveLength(1);
        const mdBlock = card.children[0];
        expect(isMdBlock(mdBlock)).toBe(true);
        if (isMdBlock(mdBlock)) {
          const content = mdBlock.lines.join("");
          expect(content).toContain("| Name | Value |");
          expect(content).toContain("| Test | 123   |");
        }
      }
    });

    it("parses md block followed by element", async () => {
      const input = `card
  md
    Some **markdown** here
  button "Save"`;
      const doc = await parse(input);
      const card = doc.elements[0];
      if (isElement(card)) {
        expect(card.children).toHaveLength(2);
        expect(isMdBlock(card.children[0])).toBe(true);
        expect(isElement(card.children[1])).toBe(true);
      }
    });
  });

  describe("html blocks", () => {
    it("parses html block", async () => {
      const input = `card
  html
    <video src="demo.mp4" controls></video>`;
      const doc = await parse(input);
      const card = doc.elements[0];
      if (isElement(card)) {
        expect(card.children).toHaveLength(1);
        const htmlBlock = card.children[0];
        expect(isHtmlBlock(htmlBlock)).toBe(true);
        if (isHtmlBlock(htmlBlock)) {
          const content = htmlBlock.lines.join("");
          expect(content).toContain("<video");
          expect(content).toContain("controls");
        }
      }
    });
  });

  describe("error handling", () => {
    it("parses unknown keyword (validation catches it later)", async () => {
      // Grammar accepts any ID as element keyword
      // Validator checks against VALID_KEYWORDS
      const doc = await parse("unknownelement");
      expect(doc.elements).toHaveLength(1);
      const el = doc.elements[0];
      if (isElement(el)) {
        expect(el.keyword).toBe("unknownelement");
      }
    });
  });

  describe("indentation errors", () => {
    it("rejects tab indentation with LOFI_INDENT_002", async () => {
      await expect(parse("\tcard")).rejects.toThrow("LOFI_INDENT_002");
    });

    it("rejects mixed tabs and spaces with LOFI_INDENT_003", async () => {
      await expect(parse("  \tcard")).rejects.toThrow("LOFI_INDENT_003");
    });

    it("rejects odd-space indentation with LOFI_INDENT_001", async () => {
      await expect(parse("card\n   heading")).rejects.toThrow(
        "LOFI_INDENT_001",
      );
    });

    it("accepts 2-space indentation", async () => {
      const doc = await parse("card\n  heading");
      expect(doc.elements).toHaveLength(1);
    });
  });
});

import type {
  Document,
  Element,
  MdBlock,
  HtmlBlock,
  TopLevelElement,
  ChildElement,
} from "@lofi/language";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

/**
 * SVG filters for hand-drawn wobble effect.
 * Include once per document for the `wobble` and `wobble-subtle` utility classes to work.
 */
export const SVG_WOBBLE_FILTER = `<svg style="position:absolute;width:0;height:0" aria-hidden="true">
  <filter id="lofi-wobble">
    <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
  </filter>
  <filter id="lofi-wobble-subtle">
    <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="1" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5" />
  </filter>
</svg>`;

import {
  renderPage,
  renderSection,
  renderCard,
  renderGrid,
  renderForm,
  renderModal,
  renderAlert,
  renderNav,
  renderBreadcrumb,
  renderTabs,
  renderMenu,
} from "./renderers/containers.js";

import {
  renderButton,
  renderInput,
  renderCheckbox,
  renderRadio,
  renderDropdown,
  renderTextarea,
  renderLink,
  renderTab,
  renderToggle,
  renderSlider,
} from "./renderers/controls.js";

import * as styles from "./styles.js";
import { stripQuotes, escapeHtml } from "./renderers/utils.js";

function renderAccordionItem(
  sectionEl: Element,
  renderNodeFn: (node: TopLevelElement | ChildElement) => string,
): string {
  const headingEl = sectionEl.children.find(
    (c) => c.$type === "Element" && c.keyword === "heading",
  ) as Element | undefined;

  const title = headingEl ? stripQuotes(headingEl.content) : "Section";

  const contentChildren = sectionEl.children.filter(
    (c) =>
      !(c.$type === "Element" && c.keyword === "heading" && c === headingEl),
  );
  const contentHtml = contentChildren.map(renderNodeFn).join("\n");

  return `<details class="accordion-item" open><summary class="accordion-trigger">${escapeHtml(title)}</summary><div class="accordion-content">${contentHtml}</div></details>`;
}

import {
  renderHeading,
  renderText,
  renderImage,
  renderIcon,
  renderBadge,
  renderToast,
  renderAvatar,
  renderProgress,
  renderChart,
} from "./renderers/content.js";

function renderAccordionWithItems(el: Element): string {
  const cls = styles.accordion();
  const items = el.children
    .filter((c) => c.$type === "Element" && c.keyword === "section")
    .map((sectionEl) => renderAccordionItem(sectionEl as Element, renderNode))
    .join("\n");
  return `<div class="${cls}">${items}</div>`;
}

/**
 * Generate HTML from a lofi document.
 * @param doc - Parsed lofi document
 * @param options.includeFilter - Include SVG wobble filter (default: true)
 */
export function generate(
  doc: Document,
  options: { includeFilter?: boolean } = {},
): string {
  const { includeFilter = true } = options;
  const content = doc.elements.map(renderNode).join("\n");
  return includeFilter ? `${SVG_WOBBLE_FILTER}\n${content}` : content;
}

function renderNode(node: TopLevelElement | ChildElement): string {
  switch (node.$type) {
    case "Element":
      return renderElement(node);
    case "MdBlock":
      return renderMarkdown(node);
    case "HtmlBlock":
      return renderHtml(node);
  }
}

function renderElement(el: Element): string {
  const children = el.children.map(renderNode).join("\n");

  switch (el.keyword) {
    // Containers (11)
    case "page":
      return renderPage(el, children);
    case "section":
      return renderSection(el, children);
    case "card":
      return renderCard(el, children);
    case "grid":
      return renderGrid(el, children);
    case "form":
      return renderForm(el, children);
    case "modal":
      return renderModal(el, children);
    case "alert":
      return renderAlert(el, children);
    case "nav":
      return renderNav(el, children);
    case "breadcrumb":
      return renderBreadcrumb(el, children);
    case "tabs":
      return renderTabs(el, children);
    case "menu":
      return renderMenu(el, children);

    // Controls (11)
    case "button":
      return renderButton(el);
    case "input":
      return renderInput(el);
    case "checkbox":
      return renderCheckbox(el);
    case "radio":
      return renderRadio(el);
    case "dropdown":
      return renderDropdown(el);
    case "textarea":
      return renderTextarea(el);
    case "link":
      return renderLink(el);
    case "tab":
      return renderTab(el);
    case "accordion":
      return renderAccordionWithItems(el);
    case "toggle":
      return renderToggle(el);
    case "slider":
      return renderSlider(el);

    // Content (9)
    case "heading":
      return renderHeading(el);
    case "text":
      return renderText(el);
    case "image":
      return renderImage(el);
    case "icon":
      return renderIcon(el);
    case "badge":
      return renderBadge(el);
    case "toast":
      return renderToast(el, children);
    case "avatar":
      return renderAvatar(el);
    case "progress":
      return renderProgress(el);
    case "chart":
      return renderChart(el);

    default: {
      const _exhaustive: never = el.keyword as never;
      return `<!-- Unknown element: ${el.keyword} -->`;
    }
  }
}

/*
 * SECURITY NOTE: remark-html allows raw HTML in markdown by default.
 * This is intentional for local dev tooling where input is trusted.
 * For untrusted input, use { sanitize: true } option.
 */
function renderMarkdown(block: MdBlock): string {
  const md = block.lines.join("\n");
  const html = remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .processSync(md)
    .toString();
  return `<div class="lofi-md">${html}</div>`;
}

function renderHtml(block: HtmlBlock): string {
  return block.lines.join("\n");
}

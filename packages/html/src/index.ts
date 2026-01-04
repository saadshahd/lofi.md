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
  renderAccordion,
  renderToggle,
  renderSlider,
} from "./renderers/controls.js";

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

export function generate(doc: Document): string {
  return doc.elements.map(renderNode).join("\n");
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
      return renderAccordion(el, children);
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

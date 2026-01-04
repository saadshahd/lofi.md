import type { Element } from "@lofi/language";
import * as styles from "../styles.js";
import { escapeHtml, getAttr, hasAttr, stripQuotes } from "./utils.js";

export function renderPage(el: Element, children: string): string {
  const title = stripQuotes(el.content);
  const cls = styles.page();
  const titleHtml = title
    ? `<h1 class="text-2xl font-bold mb-4">${escapeHtml(title)}</h1>`
    : "";
  return `<div class="${cls}">${titleHtml}${children}</div>`;
}

export function renderSection(el: Element, children: string): string {
  const align = getAttr(el.attrs, "align") as
    | "left"
    | "center"
    | "right"
    | undefined;
  const cls = styles.section({ align });
  return `<section class="${cls}">${children}</section>`;
}

export function renderCard(el: Element, children: string): string {
  const cls = styles.card();
  return `<div class="${cls}">${children}</div>`;
}

export function renderGrid(el: Element, children: string): string {
  const flow = getAttr(el.attrs, "flow") as "row" | "col" | undefined;
  const cols = getAttr(el.attrs, "cols") as
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | undefined;
  const gap = getAttr(el.attrs, "gap") as
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | undefined;
  const justify = getAttr(el.attrs, "justify") as
    | "start"
    | "center"
    | "end"
    | "between"
    | undefined;
  const align = getAttr(el.attrs, "align") as
    | "start"
    | "center"
    | "end"
    | "stretch"
    | undefined;
  const place = getAttr(el.attrs, "place") as "center" | undefined;

  const cls = styles.grid({ flow, cols, gap, justify, align, place });
  return `<div class="${cls}">${children}</div>`;
}

export function renderForm(el: Element, children: string): string {
  const cls = styles.form();
  return `<form class="${cls}">${children}</form>`;
}

export function renderModal(el: Element, children: string): string {
  const title = stripQuotes(getAttr(el.attrs, "title"));
  const position = getAttr(el.attrs, "position") as
    | "center"
    | "left"
    | "right"
    | "bottom"
    | undefined;
  const cls = styles.modal({ position });
  const titleHtml = title
    ? `<h2 class="text-lg font-semibold mb-4">${escapeHtml(title)}</h2>`
    : "";
  return `<div class="${cls}">${titleHtml}${children}</div>`;
}

export function renderAlert(el: Element, children: string): string {
  const type = getAttr(el.attrs, "type") as
    | "info"
    | "success"
    | "warning"
    | "error"
    | undefined;
  const hidden = hasAttr(el.attrs, "hidden");
  const cls = styles.alert({ type, hidden });
  return `<div role="alert" class="${cls}">${children}</div>`;
}

export function renderNav(el: Element, children: string): string {
  const cls = styles.nav();
  return `<nav class="${cls}">${children}</nav>`;
}

export function renderBreadcrumb(el: Element, children: string): string {
  const separator = stripQuotes(getAttr(el.attrs, "separator")) || "/";
  const cls = styles.breadcrumb();
  return `<nav aria-label="Breadcrumb" class="${cls}" data-separator="${escapeHtml(separator)}">${children}</nav>`;
}

export function renderTabs(el: Element, children: string): string {
  const cls = styles.tabs();
  return `<div role="tablist" class="${cls}">${children}</div>`;
}

export function renderMenu(el: Element, children: string): string {
  const cls = styles.menu();
  return `<div role="menu" class="${cls}">${children}</div>`;
}

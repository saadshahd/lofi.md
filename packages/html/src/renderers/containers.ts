import type { Element } from "@lofi/language";
import { getIconSvg } from "../icons.js";
import * as styles from "../styles.js";
import { escapeHtml, getAttr, hasAttr, stripQuotes } from "./utils.js";

const alertIconMap = {
  info: "info",
  success: "check-circle",
  warning: "warning",
  error: "x-circle",
} as const;

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
  const flow = getAttr(el.attrs, "flow") as
    | "horizontal"
    | "vertical"
    | undefined;
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
  const align = getAttr(el.attrs, "align") as
    | "start"
    | "center"
    | "end"
    | "between"
    | undefined;
  const items = getAttr(el.attrs, "items") as
    | "start"
    | "center"
    | "end"
    | "stretch"
    | undefined;
  const place = getAttr(el.attrs, "place") as "center" | undefined;

  const cls = styles.grid({ flow, cols, gap, align, items, place });
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
    ? `<h2 class="text-lg font-semibold font-sketch">${escapeHtml(title)}</h2>`
    : "";
  return `<div class="${cls}">${titleHtml}${children}</div>`;
}

export function renderAlert(el: Element, children: string): string {
  const type = (getAttr(el.attrs, "type") ??
    "info") as keyof typeof alertIconMap;
  const hidden = hasAttr(el.attrs, "hidden");
  const cls = styles.alert({ type, hidden });

  const iconName = alertIconMap[type];
  const iconSvg = getIconSvg(iconName, "w-5 h-5 shrink-0");

  return `<div role="alert" class="${cls}">${iconSvg}${children}</div>`;
}

export function renderNav(el: Element, children: string): string {
  const cls = styles.nav();
  return `<nav class="${cls}">${children}</nav>`;
}

export function renderBreadcrumb(el: Element, children: string): string {
  const separator = stripQuotes(getAttr(el.attrs, "separator")) || "/";
  const cls = styles.breadcrumb();
  return `<nav aria-label="Breadcrumb" class="${cls}" data-separator="${escapeHtml(
    separator,
  )}">${children}</nav>`;
}

export function renderTabs(el: Element, children: string): string {
  const cls = styles.tabs();
  return `<div role="tablist" class="${cls}">${children}</div>`;
}

export function renderMenu(el: Element, children: string): string {
  const cls = styles.menu();
  return `<div role="menu" class="${cls}">${children}</div>`;
}

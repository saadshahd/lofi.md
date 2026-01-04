import type { Element } from "@lofi/language";
import { getIconSvg } from "../icons.js";
import * as styles from "../styles.js";
import { escapeHtml, getAttr, hasAttr, stripQuotes } from "./utils.js";

export function renderHeading(el: Element): string {
  const text = stripQuotes(el.content);
  const level = (getAttr(el.attrs, "level") || "1") as
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6";
  const cls = styles.heading({ level });
  const tag = `h${level}`;
  return `<${tag} class="${cls}">${escapeHtml(text)}</${tag}>`;
}

export function renderText(el: Element): string {
  const content = stripQuotes(el.content);
  const muted = hasAttr(el.attrs, "muted");
  const cls = styles.text({ muted });
  return `<p class="${cls}">${escapeHtml(content)}</p>`;
}

export function renderImage(el: Element): string {
  const src = stripQuotes(getAttr(el.attrs, "src")) || "";
  const alt = stripQuotes(getAttr(el.attrs, "alt")) || "";
  const cls = styles.image();
  return `<img class="not-last:mb-2 not-first:mt-2" src="${escapeHtml(
    src
  )}" alt="${escapeHtml(alt)}" class="${cls}" />`;
}

export function renderIcon(el: Element): string {
  const name = stripQuotes(getAttr(el.attrs, "name")) || "circle";
  const size = getAttr(el.attrs, "size") as
    | "small"
    | "medium"
    | "large"
    | undefined;
  const cls = styles.icon({ size });
  return getIconSvg(name, cls);
}

export function renderBadge(el: Element): string {
  const text = stripQuotes(el.content);
  const type = getAttr(el.attrs, "type") as
    | "info"
    | "success"
    | "warning"
    | "error"
    | undefined;
  const cls = styles.badge({ type });
  return `<span class="${cls}">${escapeHtml(text)}</span>`;
}

export function renderToast(el: Element, children: string): string {
  const type = getAttr(el.attrs, "type") as
    | "info"
    | "success"
    | "warning"
    | "error"
    | undefined;
  const position = getAttr(el.attrs, "position") as
    | "top"
    | "bottom"
    | undefined;
  const cls = styles.toast({ type, position });
  return `<div role="alert" class="${cls}">${children}</div>`;
}

export function renderAvatar(el: Element): string {
  const src = stripQuotes(getAttr(el.attrs, "src"));
  const alt = stripQuotes(getAttr(el.attrs, "alt")) || "";
  const size = getAttr(el.attrs, "size") as
    | "small"
    | "medium"
    | "large"
    | undefined;
  const cls = styles.avatar({ size });

  if (src) {
    return `<div class="${cls}"><img src="${escapeHtml(src)}" alt="${escapeHtml(
      alt
    )}" class="w-full h-full object-cover" /></div>`;
  }
  const initials = alt
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return `<div class="${cls} flex items-center justify-center text-lofi font-medium">${escapeHtml(
    initials
  )}</div>`;
}

export function renderProgress(el: Element): string {
  const value = getAttr(el.attrs, "value") || "0";
  const size = getAttr(el.attrs, "size") as
    | "small"
    | "medium"
    | "large"
    | undefined;
  const cls = styles.progress({ size });
  const percentage = Math.min(
    100,
    Math.max(0, Number.parseInt(value, 10) || 0)
  );
  return `<div class="${cls}" role="progressbar" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-lofi rounded-full" style="width: ${percentage}%"></div></div>`;
}

export function renderChart(el: Element): string {
  const label = stripQuotes(el.content);
  const type = stripQuotes(getAttr(el.attrs, "type")) || "bar";
  const cls = styles.chart();
  return `<div class="${cls}" data-chart-type="${escapeHtml(
    type
  )}">[${escapeHtml(type)} chart: ${escapeHtml(label)}]</div>`;
}

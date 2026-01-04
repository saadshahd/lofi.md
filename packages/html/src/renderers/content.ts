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
    src,
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
      alt,
    )}" class="w-full h-full object-cover" /></div>`;
  }
  const initials = alt
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return `<div class="${cls} flex items-center justify-center text-lofi font-medium">${escapeHtml(
    initials,
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
    Math.max(0, Number.parseInt(value, 10) || 0),
  );
  return `<div class="${cls}" role="progressbar" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-lofi rounded-full" style="width: ${percentage}%"></div></div>`;
}

const chartSvgs: Record<string, string> = {
  bar: `<svg viewBox="0 0 200 100" class="w-full h-full opacity-40">
    <rect x="20" y="60" width="25" height="35" fill="currentColor" rx="2"/>
    <rect x="55" y="30" width="25" height="65" fill="currentColor" rx="2"/>
    <rect x="90" y="45" width="25" height="50" fill="currentColor" rx="2"/>
    <rect x="125" y="20" width="25" height="75" fill="currentColor" rx="2"/>
    <rect x="160" y="50" width="25" height="45" fill="currentColor" rx="2"/>
  </svg>`,
  line: `<svg viewBox="0 0 200 100" class="w-full h-full opacity-40">
    <polyline points="15,70 50,45 85,55 120,25 155,40 190,20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="15" cy="70" r="4" fill="currentColor"/>
    <circle cx="50" cy="45" r="4" fill="currentColor"/>
    <circle cx="85" cy="55" r="4" fill="currentColor"/>
    <circle cx="120" cy="25" r="4" fill="currentColor"/>
    <circle cx="155" cy="40" r="4" fill="currentColor"/>
    <circle cx="190" cy="20" r="4" fill="currentColor"/>
  </svg>`,
  pie: `<svg viewBox="0 0 100 100" class="w-full h-full opacity-40">
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="20" stroke-dasharray="75 251" transform="rotate(-90 50 50)"/>
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="20" stroke-dasharray="60 251" stroke-dashoffset="-75" transform="rotate(-90 50 50)" opacity="0.6"/>
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="20" stroke-dasharray="50 251" stroke-dashoffset="-135" transform="rotate(-90 50 50)" opacity="0.3"/>
  </svg>`,
  area: `<svg viewBox="0 0 200 100" class="w-full h-full opacity-40">
    <polygon points="15,95 15,70 50,45 85,55 120,25 155,40 190,20 190,95" fill="currentColor" opacity="0.3"/>
    <polyline points="15,70 50,45 85,55 120,25 155,40 190,20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  donut: `<svg viewBox="0 0 100 100" class="w-full h-full opacity-40">
    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="12" stroke-dasharray="66 220" transform="rotate(-90 50 50)"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="12" stroke-dasharray="55 220" stroke-dashoffset="-66" transform="rotate(-90 50 50)" opacity="0.6"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="12" stroke-dasharray="44 220" stroke-dashoffset="-121" transform="rotate(-90 50 50)" opacity="0.3"/>
  </svg>`,
};

export function renderChart(el: Element): string {
  const label = stripQuotes(el.content);
  const type = stripQuotes(getAttr(el.attrs, "type")) || "bar";
  const aspect = type === "pie" || type === "donut" ? "square" : "video";
  const cls = styles.chart({ aspect });
  const svg = chartSvgs[type] || chartSvgs.bar;
  return `<div class="${cls}" data-chart-type="${escapeHtml(type)}">
    ${svg}
    <span class="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs">${escapeHtml(label)}</span>
  </div>`;
}

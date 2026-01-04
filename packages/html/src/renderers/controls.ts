import type { Element } from "@lofi/language";
import * as styles from "../styles.js";
import { escapeHtml, getAttr, hasAttr, stripQuotes } from "./utils.js";

export function renderButton(el: Element): string {
  const text = stripQuotes(el.content);

  let intent: "primary" | "secondary" | "danger" = "secondary";
  if (hasAttr(el.attrs, "primary")) intent = "primary";
  else if (hasAttr(el.attrs, "danger")) intent = "danger";

  const disabled = hasAttr(el.attrs, "disabled");
  const cls = styles.button({ intent });
  const disabledAttr = disabled ? " disabled" : "";

  return `<button class="${cls}"${disabledAttr}>${escapeHtml(text)}</button>`;
}

export function renderInput(el: Element): string {
  const label = stripQuotes(el.content);
  const type = stripQuotes(getAttr(el.attrs, "type")) || "text";
  const placeholder = stripQuotes(getAttr(el.attrs, "placeholder"));
  const required = hasAttr(el.attrs, "required");
  const disabled = hasAttr(el.attrs, "disabled");
  const error = hasAttr(el.attrs, "error");
  const inline = !label;
  const cls = styles.input({ disabled, error, inline });

  const id = label
    ? `input-${label.toLowerCase().replace(/\s+/g, "-")}`
    : `input-${Math.random().toString(36).slice(2, 8)}`;
  const requiredAttr = required ? " required" : "";
  const disabledAttr = disabled ? " disabled" : "";
  const placeholderAttr = placeholder
    ? ` placeholder="${escapeHtml(placeholder)}"`
    : "";

  if (!label) {
    return `<input id="${id}" type="${type}" class="${cls}"${placeholderAttr}${requiredAttr}${disabledAttr} />`;
  }

  return `<div class="flex flex-col gap-1.5"><label for="${id}" class="text-sm font-medium text-lofi font-hand">${escapeHtml(
    label,
  )}</label><input id="${id}" type="${type}" class="${cls}"${placeholderAttr}${requiredAttr}${disabledAttr} /></div>`;
}

export function renderCheckbox(el: Element): string {
  const label = stripQuotes(el.content);
  const checked = hasAttr(el.attrs, "checked");
  const disabled = hasAttr(el.attrs, "disabled");
  const cls = styles.checkbox({ disabled });

  const id = `checkbox-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const checkedAttr = checked ? " checked" : "";
  const disabledAttr = disabled ? " disabled" : "";

  return `<div class="flex items-center gap-2"><input type="checkbox" id="${id}" class="${cls}"${checkedAttr}${disabledAttr} /><label for="${id}" class="text-sm text-lofi font-hand">${escapeHtml(
    label,
  )}</label></div>`;
}

export function renderRadio(el: Element): string {
  const label = stripQuotes(el.content);
  const name = stripQuotes(getAttr(el.attrs, "name")) || "radio-group";
  const selected = hasAttr(el.attrs, "selected");
  const disabled = hasAttr(el.attrs, "disabled");
  const cls = styles.radio({ disabled });

  const id = `radio-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const checkedAttr = selected ? " checked" : "";
  const disabledAttr = disabled ? " disabled" : "";

  return `<div class="flex items-center gap-2"><input type="radio" id="${id}" name="${name}" class="${cls}"${checkedAttr}${disabledAttr} /><label for="${id}" class="text-sm text-lofi font-hand">${escapeHtml(
    label,
  )}</label></div>`;
}

export function renderDropdown(el: Element): string {
  const label = stripQuotes(el.content);
  const options = stripQuotes(getAttr(el.attrs, "options"))
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  const placeholder = stripQuotes(getAttr(el.attrs, "placeholder"));
  const cls = styles.dropdown();

  const id = `dropdown-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const optionsHtml = options
    .map((o) => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`)
    .join("");
  const placeholderOption = placeholder
    ? `<option value="" disabled selected>${escapeHtml(placeholder)}</option>`
    : "";

  const labelHtml = label
    ? `<label for="${id}" class="text-sm font-medium text-lofi font-hand">${escapeHtml(
        label,
      )}</label>`
    : "";
  return `<div class="flex flex-col gap-1.5">${labelHtml}<select id="${id}" class="${cls}">${placeholderOption}${optionsHtml}</select></div>`;
}

export function renderTextarea(el: Element): string {
  const label = stripQuotes(el.content);
  const rows = getAttr(el.attrs, "rows") || "3";
  const placeholder = stripQuotes(getAttr(el.attrs, "placeholder"));
  const cls = styles.textarea();

  const id = `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const placeholderAttr = placeholder
    ? ` placeholder="${escapeHtml(placeholder)}"`
    : "";

  const labelHtml = label
    ? `<label for="${id}" class="text-sm font-medium text-lofi font-hand">${escapeHtml(
        label,
      )}</label>`
    : "";
  return `<div class="flex flex-col gap-1.5">${labelHtml}<textarea id="${id}" rows="${rows}" class="${cls}"${placeholderAttr}></textarea></div>`;
}

export function renderLink(el: Element): string {
  const text = stripQuotes(el.content);
  const href = stripQuotes(getAttr(el.attrs, "href")) || "#";
  const active = hasAttr(el.attrs, "active");
  const cls = styles.link({ active });
  return `<a href="${escapeHtml(href)}" class="${cls}">${escapeHtml(text)}</a>`;
}

export function renderTab(el: Element): string {
  const label = stripQuotes(el.content);
  const active = hasAttr(el.attrs, "active");
  const cls = styles.tab({ active });
  return `<button role="tab" class="${cls}" aria-selected="${active}">${escapeHtml(
    label,
  )}</button>`;
}

export function renderAccordion(el: Element, children: string): string {
  const cls = styles.accordion();
  return `<div class="${cls}">${children}</div>`;
}

export function renderToggle(el: Element): string {
  const label = stripQuotes(el.content);
  const checked = hasAttr(el.attrs, "checked");
  const disabled = hasAttr(el.attrs, "disabled");
  const cls = styles.toggle({ checked, disabled });

  const id = `toggle-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const disabledAttr = disabled ? " disabled" : "";

  const knobPosition = checked ? "translate-x-5" : "translate-x-0";
  return `<div class="flex items-center gap-2"><button type="button" role="switch" id="${id}" class="${cls}" aria-checked="${checked}"${disabledAttr}><span class="sr-only">${escapeHtml(
    label,
  )}</span><span class="pointer-events-none inline-block h-5 w-5 rounded-full bg-lofi-bg shadow transform transition ${knobPosition}"></span></button><label for="${id}" class="text-sm text-lofi font-hand">${escapeHtml(
    label,
  )}</label></div>`;
}

export function renderSlider(el: Element): string {
  const label = stripQuotes(el.content);
  const min = getAttr(el.attrs, "min") || "0";
  const max = getAttr(el.attrs, "max") || "100";
  const value = getAttr(el.attrs, "value") || "50";
  const disabled = hasAttr(el.attrs, "disabled");
  const cls = styles.slider({ disabled });

  const id = `slider-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const disabledAttr = disabled ? " disabled" : "";

  const labelHtml = label
    ? `<label for="${id}" class="text-sm font-medium text-lofi font-hand">${escapeHtml(
        label,
      )}</label>`
    : "";
  return `<div class="flex flex-col gap-1.5">${labelHtml}<input type="range" id="${id}" min="${min}" max="${max}" value="${value}" class="${cls}"${disabledAttr} /></div>`;
}

/**
 * Element schema definitions for lofi validation.
 * Derived from SYNTAX.md - single source of truth for element attributes.
 */

export interface AttrSchema {
  type: "boolean" | "number" | "enum" | "string";
  values?: readonly string[];
  min?: number;
  max?: number;
}

export interface ElementSchema {
  requiresContent: boolean;
  validAttrs: ReadonlyMap<string, AttrSchema>;
}

function attrs(
  defs: Record<string, AttrSchema>,
): ReadonlyMap<string, AttrSchema> {
  return new Map(Object.entries(defs));
}

const BOOLEAN: AttrSchema = { type: "boolean" };
const STRING: AttrSchema = { type: "string" };

export const ELEMENT_SCHEMAS: Readonly<Record<string, ElementSchema>> = {
  /*
   * Containers (11)
   */
  page: {
    requiresContent: true,
    validAttrs: attrs({}),
  },
  section: {
    requiresContent: false,
    validAttrs: attrs({
      align: { type: "enum", values: ["center", "left", "right"] },
    }),
  },
  card: {
    requiresContent: false,
    validAttrs: attrs({}),
  },
  grid: {
    requiresContent: false,
    validAttrs: attrs({
      flow: { type: "enum", values: ["row", "col"] },
      cols: { type: "number", min: 1, max: 12 },
      gap: { type: "number", min: 1, max: 6 },
      align: { type: "enum", values: ["start", "center", "end", "between"] },
      items: { type: "enum", values: ["start", "center", "end", "stretch"] },
      place: { type: "enum", values: ["center"] },
    }),
  },
  form: {
    requiresContent: false,
    validAttrs: attrs({}),
  },
  modal: {
    requiresContent: false,
    validAttrs: attrs({
      title: STRING,
      position: {
        type: "enum",
        values: ["center", "left", "right", "bottom"],
      },
    }),
  },
  alert: {
    requiresContent: false,
    validAttrs: attrs({
      type: { type: "enum", values: ["info", "success", "warning", "error"] },
      hidden: BOOLEAN,
    }),
  },
  nav: {
    requiresContent: false,
    validAttrs: attrs({}),
  },
  breadcrumb: {
    requiresContent: false,
    validAttrs: attrs({
      separator: STRING,
    }),
  },
  tabs: {
    requiresContent: false,
    validAttrs: attrs({}),
  },
  menu: {
    requiresContent: false,
    validAttrs: attrs({}),
  },

  /*
   * Controls (11)
   */
  button: {
    requiresContent: true,
    validAttrs: attrs({
      variant: { type: "enum", values: ["primary", "secondary", "danger"] },
      disabled: BOOLEAN,
    }),
  },
  input: {
    requiresContent: true,
    validAttrs: attrs({
      type: {
        type: "enum",
        values: ["text", "email", "password", "tel", "url", "number", "date"],
      },
      placeholder: STRING,
      required: BOOLEAN,
      disabled: BOOLEAN,
      error: BOOLEAN,
    }),
  },
  checkbox: {
    requiresContent: true,
    validAttrs: attrs({
      checked: BOOLEAN,
      disabled: BOOLEAN,
    }),
  },
  radio: {
    requiresContent: true,
    validAttrs: attrs({
      name: STRING,
      selected: BOOLEAN,
      disabled: BOOLEAN,
    }),
  },
  dropdown: {
    requiresContent: true,
    validAttrs: attrs({
      options: STRING,
      placeholder: STRING,
    }),
  },
  textarea: {
    requiresContent: true,
    validAttrs: attrs({
      rows: { type: "number", min: 1, max: 20 },
      placeholder: STRING,
    }),
  },
  link: {
    requiresContent: true,
    validAttrs: attrs({
      href: STRING,
      active: BOOLEAN,
    }),
  },
  tab: {
    requiresContent: true,
    validAttrs: attrs({
      active: BOOLEAN,
    }),
  },
  accordion: {
    requiresContent: false,
    validAttrs: attrs({}),
  },
  toggle: {
    requiresContent: true,
    validAttrs: attrs({
      checked: BOOLEAN,
      disabled: BOOLEAN,
    }),
  },
  slider: {
    requiresContent: true,
    validAttrs: attrs({
      min: { type: "number" },
      max: { type: "number" },
      value: { type: "number" },
      disabled: BOOLEAN,
    }),
  },

  /*
   * Content (9)
   */
  heading: {
    requiresContent: true,
    validAttrs: attrs({
      level: { type: "number", min: 1, max: 6 },
    }),
  },
  text: {
    requiresContent: true,
    validAttrs: attrs({
      muted: BOOLEAN,
    }),
  },
  image: {
    requiresContent: false,
    validAttrs: attrs({
      src: STRING,
      alt: STRING,
    }),
  },
  icon: {
    requiresContent: false,
    validAttrs: attrs({
      name: STRING,
      size: { type: "enum", values: ["small", "medium", "large"] },
    }),
  },
  badge: {
    requiresContent: true,
    validAttrs: attrs({
      type: { type: "enum", values: ["info", "success", "warning", "error"] },
    }),
  },
  toast: {
    requiresContent: false,
    validAttrs: attrs({
      type: { type: "enum", values: ["info", "success", "error"] },
      position: { type: "enum", values: ["top", "bottom"] },
    }),
  },
  avatar: {
    requiresContent: false,
    validAttrs: attrs({
      src: STRING,
      alt: STRING,
      size: { type: "enum", values: ["small", "medium", "large"] },
    }),
  },
  progress: {
    requiresContent: false,
    validAttrs: attrs({
      value: { type: "number", min: 0, max: 100 },
      size: { type: "enum", values: ["small", "medium", "large"] },
    }),
  },
  chart: {
    requiresContent: true,
    validAttrs: attrs({
      type: { type: "enum", values: ["bar", "line", "pie", "area", "donut"] },
    }),
  },
};

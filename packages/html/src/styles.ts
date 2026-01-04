import { cva } from "class-variance-authority";

/*
 * CVA definitions for all 31 lofi elements.
 * Uses Tailwind v4 @theme tokens from lofi.css for hand-drawn sketch aesthetic.
 * Containers get wobble effect, icons stay clean.
 */

// ============================================================================
// CONTAINERS (11) - All get wobble effect for sketchy borders
// ============================================================================

export const page = cva("min-h-screen p-6 bg-lofi-bg text-lofi font-hand");

export const section = cva("py-6", {
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
});

export const card = cva(
  "rounded-lofi border-2 border-lofi-border bg-lofi-bg p-4 wobble shadow-hard"
);

/*
 * Grid uses CSS Grid for explicit column layouts (cols attribute),
 * but flexbox for flow-based layouts (flow attribute) since flex
 * naturally sizes items to content without stretching.
 */
export const grid = cva("", {
  variants: {
    flow: {
      horizontal: "flex flex-row",
      vertical: "flex flex-col",
    },
    cols: {
      "1": "grid grid-cols-1",
      "2": "grid grid-cols-2",
      "3": "grid grid-cols-3",
      "4": "grid grid-cols-4",
      "5": "grid grid-cols-5",
      "6": "grid grid-cols-6",
    },
    gap: {
      "1": "gap-1",
      "2": "gap-2",
      "3": "gap-3",
      "4": "gap-4",
      "5": "gap-5",
      "6": "gap-6",
    },
    align: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    place: {
      center: "place-items-center",
    },
  },
  defaultVariants: {
    gap: "4",
  },
});

export const form = cva("flex flex-col gap-4");

export const modal = cva(
  "fixed bg-lofi-bg rounded-lofi border-2 border-lofi-border p-6 max-w-md w-full wobble shadow-hard",
  {
    variants: {
      position: {
        center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        left: "top-1/2 left-4 -translate-y-1/2",
        right: "top-1/2 right-4 -translate-y-1/2",
        bottom: "bottom-4 left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      position: "center",
    },
  }
);

export const alert = cva(
  "rounded-lofi border-2 p-4 font-hand wobble flex items-start gap-1.5 leading-none [&>p]:mt-1",
  {
    variants: {
      type: {
        info: "border-lofi-accent bg-lofi-accent/10 text-lofi",
        success: "border-lofi-success bg-lofi-success/10 text-lofi",
        warning: "border-lofi-warning bg-lofi-warning/20 text-lofi",
        error: "border-lofi-error bg-lofi-error/10 text-lofi",
      },
      hidden: {
        true: "hidden",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

export const nav = cva("flex items-center gap-4 mb-4");

export const breadcrumb = cva(
  "flex items-center gap-2 text-sm text-lofi-text-muted font-hand mb-4"
);

export const tabs = cva("flex border-b-2 border-lofi-border");

export const menu = cva("flex flex-col");

// ============================================================================
// CONTROLS (11) - Interactive elements with wobble effect
// ============================================================================

export const button = cva("btn", {
  variants: {
    intent: {
      primary: "btn-primary",
      secondary: "btn-secondary",
      danger: "btn-danger",
    },
  },
  defaultVariants: {
    intent: "secondary",
  },
});

export const input = cva(
  "flex h-10 w-full rounded-lofi border-2 border-lofi-border bg-lofi-bg px-3 py-2 text-sm font-hand placeholder:text-lofi-placeholder focus:outline-none focus-visible:focus-lofi wobble",
  {
    variants: {
      disabled: {
        true: "opacity-50 cursor-not-allowed bg-lofi-muted",
      },
      error: {
        true: "border-lofi-error focus:ring-lofi-error",
      },
    },
  }
);

export const checkbox = cva(
  "h-4 w-4 rounded-lofi border-2 border-lofi-border accent-lofi focus-visible:focus-lofi",
  {
    variants: {
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
  }
);

export const radio = cva(
  "h-4 w-4 border-2 border-lofi-border accent-lofi focus-visible:focus-lofi",
  {
    variants: {
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
  }
);

export const dropdown = cva(
  "flex h-10 w-full items-center justify-between rounded-lofi border-2 border-lofi-border bg-lofi-bg px-3 py-2 text-sm font-hand focus:outline-none focus-visible:focus-lofi wobble"
);

export const textarea = cva(
  "flex w-full rounded-lofi border-2 border-lofi-border bg-lofi-bg px-3 py-2 text-sm font-hand placeholder:text-lofi-placeholder focus:outline-none focus-visible:focus-lofi wobble"
);

export const link = cva(
  "text-lofi-accent underline link-underline hover:opacity-80 font-hand focus-visible:focus-lofi",
  {
    variants: {
      active: {
        true: "font-medium",
      },
    },
  }
);

export const tab = cva(
  "px-4 py-2 text-sm font-hand border-b-2 border-transparent hover:border-lofi-border hover:text-lofi focus-visible:focus-lofi",
  {
    variants: {
      active: {
        true: "border-lofi text-lofi",
      },
    },
  }
);

export const accordion = cva(
  "divide-y divide-lofi-border border-2 border-lofi-border rounded-lofi wobble"
);

export const toggle = cva(
  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:focus-lofi",
  {
    variants: {
      checked: {
        true: "bg-lofi",
        false: "bg-lofi-muted",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      checked: false,
    },
  }
);

export const slider = cva(
  "w-full h-2 bg-lofi-muted rounded-full cursor-pointer accent-lofi focus-visible:focus-lofi",
  {
    variants: {
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
  }
);

// ============================================================================
// CONTENT (9) - Text elements with sketch fonts, icons stay clean
// ============================================================================

export const heading = cva("font-sketch font-bold text-lofi", {
  variants: {
    level: {
      "1": "text-4xl",
      "2": "text-3xl",
      "3": "text-2xl",
      "4": "text-xl",
      "5": "text-lg",
      "6": "text-base",
    },
  },
  defaultVariants: {
    level: "1",
  },
});

export const text = cva("text-lofi font-hand", {
  variants: {
    muted: {
      true: "text-lofi-text-muted",
    },
  },
});

export const image = cva("max-w-full h-auto rounded-lofi wobble");

export const icon = cva("inline-block text-lofi wobble-subtle", {
  variants: {
    size: {
      small: "w-4 h-4",
      medium: "w-6 h-6",
      large: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export const badge = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-hand wobble not-last:mb-2 not-first:mt-2",
  {
    variants: {
      type: {
        info: "bg-lofi-accent/15 text-lofi-accent",
        success: "bg-lofi-success/15 text-lofi-success",
        warning: "bg-lofi-warning/25 text-lofi-warning",
        error: "bg-lofi-error/15 text-lofi-error",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

export const toast = cva(
  "fixed rounded-lofi border-2 border-lofi-border bg-lofi-bg p-4 font-hand wobble shadow-hard",
  {
    variants: {
      type: {
        info: "border-lofi-accent",
        success: "border-lofi-success",
        warning: "border-lofi-warning",
        error: "border-lofi-error",
      },
      position: {
        top: "top-4 left-1/2 -translate-x-1/2",
        bottom: "bottom-4 left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      position: "top",
    },
  }
);

export const avatar = cva("rounded-full bg-lofi-placeholder overflow-hidden", {
  variants: {
    size: {
      small: "w-8 h-8",
      medium: "w-10 h-10",
      large: "w-12 h-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export const progress = cva(
  "w-full rounded-full bg-lofi-muted overflow-hidden wobble",
  {
    variants: {
      size: {
        small: "h-1",
        medium: "h-2",
        large: "h-4",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

export const chart = cva(
  "w-full aspect-video bg-lofi-muted border-2 border-lofi-border rounded-lofi flex items-center justify-center text-lofi-placeholder font-hand wobble"
);

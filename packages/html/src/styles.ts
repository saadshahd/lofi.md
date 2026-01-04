import { cva } from "class-variance-authority";

/*
 * CVA definitions for all 31 lofi elements.
 * Uses basic Tailwind 4 defaults. Sketch theme deferred.
 */

// ============================================================================
// CONTAINERS (11)
// ============================================================================

export const page = cva("min-h-screen p-6");

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
  "rounded-lg border border-gray-200 bg-white p-4 shadow-sm",
);

export const grid = cva("grid", {
  variants: {
    flow: {
      row: "grid-flow-row",
      col: "grid-flow-col",
    },
    cols: {
      "1": "grid-cols-1",
      "2": "grid-cols-2",
      "3": "grid-cols-3",
      "4": "grid-cols-4",
      "5": "grid-cols-5",
      "6": "grid-cols-6",
    },
    gap: {
      "1": "gap-1",
      "2": "gap-2",
      "3": "gap-3",
      "4": "gap-4",
      "5": "gap-5",
      "6": "gap-6",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
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
  "fixed bg-white rounded-lg border border-gray-200 shadow-lg p-6 max-w-md w-full",
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
  },
);

export const alert = cva("rounded-md border p-4", {
  variants: {
    type: {
      info: "border-blue-200 bg-blue-50 text-blue-800",
      success: "border-green-200 bg-green-50 text-green-800",
      warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
      error: "border-red-200 bg-red-50 text-red-800",
    },
    hidden: {
      true: "hidden",
    },
  },
  defaultVariants: {
    type: "info",
  },
});

export const nav = cva("flex items-center gap-4");

export const breadcrumb = cva("flex items-center gap-2 text-sm text-gray-600");

export const tabs = cva("flex border-b border-gray-200");

export const menu = cva("flex flex-col");

// ============================================================================
// CONTROLS (11)
// ============================================================================

export const button = cva(
  "inline-flex items-center justify-center rounded-md border px-4 py-2 font-medium transition-colors",
  {
    variants: {
      primary: {
        true: "border-transparent bg-gray-900 text-white hover:bg-gray-800",
      },
      secondary: {
        true: "border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
      },
      danger: {
        true: "border-transparent bg-red-600 text-white hover:bg-red-500",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
      },
    },
  },
);

export const input = cva(
  "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
  {
    variants: {
      disabled: {
        true: "opacity-50 cursor-not-allowed bg-gray-100",
      },
      error: {
        true: "border-red-500 focus:ring-red-400",
      },
    },
  },
);

export const checkbox = cva(
  "h-4 w-4 rounded border border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-400",
  {
    variants: {
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
  },
);

export const radio = cva(
  "h-4 w-4 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-400",
  {
    variants: {
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
  },
);

export const dropdown = cva(
  "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400",
);

export const textarea = cva(
  "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400",
);

export const link = cva("text-blue-600 underline hover:text-blue-800", {
  variants: {
    active: {
      true: "font-medium text-blue-900",
    },
  },
});

export const tab = cva(
  "px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700",
  {
    variants: {
      active: {
        true: "border-gray-900 text-gray-900",
      },
    },
  },
);

export const accordion = cva(
  "divide-y divide-gray-200 border border-gray-200 rounded-md",
);

export const toggle = cva(
  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
  {
    variants: {
      checked: {
        true: "bg-gray-900",
        false: "bg-gray-200",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
);

export const slider = cva("w-full h-2 bg-gray-200 rounded-lg cursor-pointer", {
  variants: {
    disabled: {
      true: "opacity-50 cursor-not-allowed",
    },
  },
});

// ============================================================================
// CONTENT (9)
// ============================================================================

export const heading = cva("font-bold text-gray-900", {
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

export const text = cva("text-gray-900", {
  variants: {
    muted: {
      true: "text-gray-500",
    },
  },
});

export const image = cva("max-w-full h-auto");

export const icon = cva("inline-block", {
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
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      type: {
        info: "bg-blue-100 text-blue-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        error: "bg-red-100 text-red-800",
      },
    },
    defaultVariants: {
      type: "info",
    },
  },
);

export const toast = cva(
  "fixed rounded-md border border-gray-200 bg-white p-4 shadow-lg",
  {
    variants: {
      type: {
        info: "border-blue-200",
        success: "border-green-200",
        warning: "border-yellow-200",
        error: "border-red-200",
      },
      position: {
        top: "top-4 left-1/2 -translate-x-1/2",
        bottom: "bottom-4 left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      position: "top",
    },
  },
);

export const avatar = cva("rounded-full bg-gray-200 overflow-hidden", {
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

export const progress = cva("w-full rounded-full bg-gray-200 overflow-hidden", {
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
});

export const chart = cva(
  "w-full aspect-video bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center text-gray-400",
);

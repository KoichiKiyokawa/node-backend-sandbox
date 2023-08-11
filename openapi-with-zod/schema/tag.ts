export const TAGS = ["Users", "Posts"] as const;

export const tags = (...args: (typeof TAGS)[number][]) => args;

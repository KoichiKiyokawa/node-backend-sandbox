export const Tags = [{ name: "Users" }, { name: "Posts" }] as const;

export const tags = (...args: (typeof Tags)[number]["name"][]) => args;

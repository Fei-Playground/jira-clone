type MetaTag = { name: string; content: string } | { charSet: "utf-8" };

export const formatTags = (tags: Record<string, string>): MetaTag[] => {
  return Object.entries(tags).map(([key, value]) => {
    // `charset` is an attribute of the meta tag itself (<meta charset="utf-8">),
    // not a named meta tag. Emitting it as name/content leaves the document
    // without a declared charset, so the browser falls back to windows-1252 and
    // non-ASCII characters (such as an em dash) render as mojibake.
    if (key === "charset" && value === "utf-8") return { charSet: value };

    return { name: key, content: value };
  });
};

export const formatProperties = (properties: Record<string, string>) => {
  return Object.entries(properties).map(([key, value]) => ({
    property: key,
    content: value,
  }));
};

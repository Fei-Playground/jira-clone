export const formatTags = (tags: Record<string, string>) => {
  return Object.entries(tags).map(([key, value]) =>
    key === "charset"
      ? // A charset must be declared as <meta charset="utf-8">. The name/content
        // form is not a charset declaration, so the browser falls back to its
        // default encoding and every non-ASCII character in the server-rendered
        // page comes out garbled.
        { charSet: "utf-8" as const }
      : { name: key, content: value }
  );
};

export const formatProperties = (properties: Record<string, string>) => {
  return Object.entries(properties).map(([key, value]) => ({
    property: key,
    content: value,
  }));
};

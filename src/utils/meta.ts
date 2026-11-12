// Helpers that turn plain records into the tag/property descriptors React Router's meta() expects.
export const formatTags = (tags: Record<string, string>) => {
  return Object.entries(tags).map(([key, value]) => ({
    name: key,
    content: value,
  }));
};

export const formatProperties = (properties: Record<string, string>) => {
  return Object.entries(properties).map(([key, value]) => ({
    property: key,
    content: value,
  }));
};

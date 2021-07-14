export const customProps = {
  guild: {},
  user: {},
  emoji: {}
};

export type StructureName = "guild" | "user" | "emoji";

export const getProperties = ((structureName: StructureName) => {
  return customProps[structureName];
});

export const defineProperties = ((structureName: StructureName, data: Record<string, any>) => {
  customProps[structureName] = data;
});

export const extendProperties = ((structure: any, structureName: StructureName) => {
  const props = customProps[structureName] as Record<string, any>;
  const keys = Object.keys(props);
  const keyLength = keys.length;

  for (let i = 0; i < keyLength; i++) {
    const key = keys[i];
    const prop = props[key];

    if (typeof prop == "function") {
      structure[key] = ((...args: any[]) => {
        prop(structure, ...args);
      });
    } else {
      structure[key] = prop;
    }
  }
});

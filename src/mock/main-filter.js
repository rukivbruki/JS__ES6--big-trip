const mainFilterNames = [`Everything`, `Future`, `Past`];

export const generateMainFilters = () => {
  return mainFilterNames.map((it) => {
    return {
      name: it
    };
  });
};

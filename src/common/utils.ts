export function createLatexString(formula: string) {
  const parsedFormula = formula.replace(/\^([a-zA-Z0-9]+)/g, (_, exp) => {
    return `<sup>${exp}</sup>`;
  });
  return parsedFormula.replace(/\*/g, "⋅");
}

export function getVariablesFromFormula(formula: string) {
  const variables = formula.match(/[a-zA-Z]+/g) ?? [];
  let set = new Set<string>();
  return variables.filter((variable) => {
    if (set.has(variable)) {
      return false;
    }
    set.add(variable);
    return true;
  });
}

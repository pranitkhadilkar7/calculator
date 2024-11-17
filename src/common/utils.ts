export function createLatexString(formula: string) {
  // remove all whitespaces
  formula = formula.replace(/\s+/g, "");
  // replace all ^ with <sup>
  formula = formula.replace(/\^([a-zA-Z0-9]+)/g, (_, exp) => {
    return `<sup>${exp}</sup>`;
  });
  // replace all * with ⋅
  return formula.replace(/\*/g, "⋅");
}

export function getVariablesFromFormula(formula: string) {
  const variables = formula.match(/[a-zA-Z]/g) ?? [];
  let set = new Set<string>();
  return variables.filter((variable) => {
    if (set.has(variable)) {
      return false;
    }
    set.add(variable);
    return true;
  });
}

export function isValidFormula(formula: string) {
  // remove all whitespaces
  formula = formula.replace(/\s+/g, "");

  // check for all valid characters
  const validCharacters = /^[a-zA-Z0-9+\-*/^()]*$/;
  if (!validCharacters.test(formula)) {
    return false;
  }

  const isBalanced = isBalancedFormula(formula);

  if (!isBalanced) {
    return false;
  }

  const invalidPatterns = [
    /[+\-*/^]{2,}/, // two operators together
    /^[*/^]/, // operator * or ^ at the start
    /[+\-*/^]$/, // operator at the end
    /\(\)/, // empty ()
  ];

  for (const pattern of invalidPatterns) {
    if (pattern.test(formula)) {
      return false;
    }
  }

  return true;
}

// check if the formula is balanced with ()
export function isBalancedFormula(formula: string) {
  let stack = [];

  for (let ch of formula) {
    if (ch === "(") {
      stack.push(ch);
    } else if (ch === ")") {
      if (!stack.length) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
}

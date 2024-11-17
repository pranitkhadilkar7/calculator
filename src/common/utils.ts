export function createLatexString(formula: string) {
  // remove all whitespaces
  formula = formula.replace(/\s+/g, "");
  // replace all ^ with <sup>
  //   formula = formula.replace(/\^([a-zA-Z0-9])/g, (_, exp) => {
  //     return `<sup>${exp}</sup>`;
  //   });
  formula = generateLatexForExpontent(formula);
  // replace all * with ⋅
  return formula.replace(/\*/g, "⋅");
}

export function generateLatexForExpontent(formula: string) {
  let result = "";
  let i = 0;
  while (i < formula.length) {
    const char = formula[i];
    if (char === "^") {
      if (formula[i + 1] && /^[a-zA-Z0-9]/.test(formula[i + 1])) {
        result += `<sup>${formula[i + 1]}</sup>`;
        i += 2;
      } else if (formula[i + 2] && formula[i + 1] === "(") {
        let j = i + 2;
        let count = 1;
        while (j < formula.length && count > 0) {
          if (formula[j] === "(") {
            count++;
          } else if (formula[j] === ")") {
            count--;
          }
          j++;
        }
        result += `<sup>(${generateLatexForExpontent(
          formula.substring(i + 2, j - 1)
        )})</sup>`;
        i = j;
      } else {
        result += char;
        i++;
      }
    } else {
      result += char;
      i++;
    }
  }
  return result;
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
    /^[*/^]/, // operator *, /, ^ at the start
    /[+\-*/^]$/, // operator at the end
    /\(\)/, // empty ()
    /[a-zA-Z]{2,3}/, // consecutive variables
    /[+\-*/^]\)/, // operator followed by )
    /\([*/^]/, // followed by ( followed by operator *, /, ^
    /[a-zA-Z0-9]\(/, // variable followed by (
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

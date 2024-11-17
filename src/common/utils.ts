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
    /^[+\-*/^]/, // operator at the start
    /[+\-*/^]$/, // operator at the end
    /\(\)/, // empty ()
    /[a-zA-Z]{2,3}/, // consecutive variables
    /[+\-*/^]\)/, // operator followed by )
    /\([+\-*/^]/, // ( followed by operator *, /, ^
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

export function calculateFormulaValue(
  formula: string,
  variableWithValue: { [key: string]: number }
) {
  // Helper function to check operator precedence
  const getPrecedence = (operator: string) => {
    switch (operator) {
      case "+":
      case "-":
        return 1;
      case "*":
      case "/":
        return 2;
      case "^":
        return 3;
      default:
        return 0;
    }
  };

  // Helper function to perform arithmetic
  const applyOperator = (a: number, b: number, operator: string) => {
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return a / b;
      case "^":
        return Math.pow(a, b);
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  };

  const evaluate = (formula: string) => {
    const valuesStack: number[] = [];
    const operatorsStack: string[] = [];

    const pushOperator = (operator: string) => {
      while (
        operatorsStack.length &&
        getPrecedence(operatorsStack[operatorsStack.length - 1]) >=
          getPrecedence(operator)
      ) {
        const b = valuesStack.pop() as number;
        const a = valuesStack.pop() as number;
        const op = operatorsStack.pop() as string;
        valuesStack.push(applyOperator(a, b, op));
      }
      operatorsStack.push(operator);
    };

    for (const char of formula) {
      if (/^[0-9.]+$/.test(char)) {
        valuesStack.push(Number(char));
      } else if (/^[a-zA-Z]+$/.test(char)) {
        if (variableWithValue[char] === undefined) {
          throw new Error(`Missing value for variable: ${char}`);
        }
        valuesStack.push(variableWithValue[char]);
      } else if ("+-*/^".includes(char)) {
        pushOperator(char);
      } else if (char === "(") {
        operatorsStack.push(char);
      } else if (char === ")") {
        while (
          operatorsStack.length &&
          operatorsStack[operatorsStack.length - 1] !== "("
        ) {
          const b = valuesStack.pop() as number;
          const a = valuesStack.pop() as number;
          const op = operatorsStack.pop() as string;
          valuesStack.push(applyOperator(a, b, op));
        }
        operatorsStack.pop();
      } else {
        throw new Error(`Invalid token: ${char}`);
      }
    }

    while (operatorsStack.length) {
      const b = valuesStack.pop() as number;
      const a = valuesStack.pop() as number;
      const op = operatorsStack.pop() as string;
      valuesStack.push(applyOperator(a, b, op));
    }

    if (valuesStack.length !== 1) {
      throw new Error("Invalid formula");
    }

    return valuesStack[0];
  };

  return evaluate(formula);
}

console.log(calculateFormulaValue("a^b+c+d", { a: 2, b: 2, c: 3, d: 4 }));

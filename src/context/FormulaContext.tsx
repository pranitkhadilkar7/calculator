import { createContext, useCallback, useMemo, useState } from "react";
import {
  getVariablesFromFormula,
  isValidFormula as checkFormulaValidity,
  calculateFormulaValue,
} from "../common/utils";

type FormulaContextType = {
  formula: string;
  setFormula: (formula: string) => void;
  variables: string[];
  variableWithValue: { [key: string]: number };
  updateVariableWithValue: (variable: string, value: number) => void;
  isValidFormula: boolean;
  formulaResult?: number;
};

export const FormulaContext = createContext<FormulaContextType>({
  formula: "",
  setFormula: () => {},
  variables: [],
  variableWithValue: {},
  updateVariableWithValue: () => {},
  isValidFormula: false,
});

export function FormulaProvider({ children }: { children: React.ReactNode }) {
  const [formula, setFormula] = useState("");
  const [variableWithValue, setVariableWithValue] = useState<{
    [key: string]: number;
  }>({});

  const variables = useMemo(() => {
    return getVariablesFromFormula(formula);
  }, [formula]);

  const isValidFormula = useMemo(() => {
    if (formula) {
      return checkFormulaValidity(formula);
    }
    return false;
  }, [formula]);

  const updateVariableWithValue = useCallback(
    (variable: string, value: number) => {
      setVariableWithValue((prev) => ({
        ...prev,
        [variable]: value,
      }));
    },
    []
  );

  const hasValueForAllVariables = useMemo(() => {
    return variables.every(
      (variable) => variableWithValue[variable] !== undefined
    );
  }, [variableWithValue, variables]);

  const formulaResult = useMemo(() => {
    if (isValidFormula && formula && hasValueForAllVariables) {
      return calculateFormulaValue(formula, variableWithValue);
    }
    return NaN;
  }, [isValidFormula, formula, hasValueForAllVariables, variableWithValue]);

  return (
    <FormulaContext.Provider
      value={{
        formula,
        setFormula,
        variables,
        variableWithValue,
        updateVariableWithValue,
        isValidFormula,
        formulaResult,
      }}
    >
      {children}
    </FormulaContext.Provider>
  );
}

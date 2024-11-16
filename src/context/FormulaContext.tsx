import { createContext, useCallback, useMemo, useState } from "react";
import { getVariablesFromFormula } from "../common/utils";

type FormulaContextType = {
  formula: string;
  setFormula: (formula: string) => void;
  variables: string[];
  variableWithValue: { [key: string]: number };
  updateVariableWithValue: (variable: string, value: number) => void;
};

export const FormulaContext = createContext<FormulaContextType>({
  formula: "",
  setFormula: () => {},
  variables: [],
  variableWithValue: {},
  updateVariableWithValue: () => {},
});

export function FormulaProvider({ children }: { children: React.ReactNode }) {
  const [formula, setFormula] = useState("");
  const [variableWithValue, setVariableWithValue] = useState<{
    [key: string]: number;
  }>({});

  const variables = useMemo(() => {
    return getVariablesFromFormula(formula);
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

  return (
    <FormulaContext.Provider
      value={{
        formula,
        setFormula,
        variables,
        variableWithValue,
        updateVariableWithValue,
      }}
    >
      {children}
    </FormulaContext.Provider>
  );
}

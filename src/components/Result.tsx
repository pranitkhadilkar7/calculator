import { useContext } from "react";
import { FormulaContext } from "../context/FormulaContext";

export function Result() {
  const { formulaResult } = useContext(FormulaContext);
  return (
    <div className="mt-3">
      <p className="text-sm/6 font-medium text-gray-900">
        Result: {formulaResult}
      </p>
    </div>
  );
}

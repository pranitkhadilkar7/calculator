import { useContext } from "react";
import { FormulaContext } from "../context/FormulaContext";
import { VariableInput } from "./VariableInput";

export function VariableInputContainer() {
  const { variables } = useContext(FormulaContext);

  return (
    <div className="my-8">
      {variables.map((variable) => (
        <VariableInput key={variable} variable={variable} />
      ))}
    </div>
  );
}

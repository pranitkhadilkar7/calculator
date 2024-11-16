import { memo, useContext } from "react";
import { FormulaContext } from "../context/FormulaContext";

type Props = {
  variable: string;
};

export const VariableInput = memo(function VariableInput({ variable }: Props) {
  const { updateVariableWithValue } = useContext(FormulaContext);
  return (
    <div>
      <div className="mt-2 flex rounded-md shadow-sm">
        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
          {variable}:
        </span>
        <input
          id={variable}
          name={variable}
          type="number"
          placeholder="Enter Number"
          onChange={(e) =>
            updateVariableWithValue(variable, Number(e.target.value))
          }
          className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 px-1 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
        />
      </div>
    </div>
  );
});

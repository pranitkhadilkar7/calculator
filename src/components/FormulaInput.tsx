import { memo, useCallback, useContext, useRef, useState } from "react";
import { createLatexString } from "../common/utils";
import { FormulaContext } from "../context/FormulaContext";

export const FormulaInput = memo(function FormulaInput() {
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const [latexFormula, setLatexFormula] = useState("");
  const { setFormula, formula, isValidFormula } = useContext(FormulaContext);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formula = e.target.value;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setFormula(formula);
        const formattedFormula = createLatexString(formula);
        setLatexFormula(formattedFormula);
      }, 500);
    },
    [setFormula]
  );

  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm/6 font-medium text-gray-900"
      >
        Your Formula is:{" "}
        <span dangerouslySetInnerHTML={{ __html: latexFormula }}></span>
      </label>
      <div className="mt-2">
        <input
          id="formula-input"
          name="formula"
          type="text"
          placeholder="Enter formula here ex. a + b"
          onChange={onChange}
          className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
        />
        {formula && !isValidFormula && (
          <p className="text-red-400 text-xs">Formula is invalid</p>
        )}
      </div>
    </div>
  );
});

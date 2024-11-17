import "./App.css";
import { FormulaInput } from "./components/FormulaInput";
import { PageContainer } from "./components/PageContainer";
import { Result } from "./components/Result";
import { VariableInputContainer } from "./components/VariableInputContainer";
import { FormulaProvider } from "./context/FormulaContext";

function App() {
  return (
    <PageContainer>
      <FormulaProvider>
        <FormulaInput />
        <Result />
        <VariableInputContainer />
      </FormulaProvider>
    </PageContainer>
  );
}

export default App;

import "./App.css";
import { FormulaInput } from "./components/FormulaInput";
import { PageContainer } from "./components/PageContainer";
import { VariableInputContainer } from "./components/VariableInputContainer";
import { FormulaProvider } from "./context/FormulaContext";

function App() {
  return (
    <PageContainer>
      <FormulaProvider>
        <FormulaInput />
        <VariableInputContainer />
      </FormulaProvider>
    </PageContainer>
  );
}

export default App;

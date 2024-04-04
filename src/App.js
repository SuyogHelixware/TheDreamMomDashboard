import { ThemeProvider, useTheme } from "@mui/material/styles";
import "./App.css";
import Routing from "./Routes/Routing";

function App() {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routing />
      </div>
    </ThemeProvider>
  );
}

export default App;

 import { ThemeProvider, useTheme } from "@mui/material/styles";
import "./App.css";
import Routing from "./Routes/Routing";
import React, { useEffect } from "react";

function App() {
  const theme = useTheme();
  //     window.onload = function() {
  //       document.body.style.zoom = "80%";
  //     };   
     /// OR///
  // useEffect(() => {
  //   document.body.style.zoom = "80%";
  // }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routing />
      </div>
    </ThemeProvider>
  );
}

export default App;

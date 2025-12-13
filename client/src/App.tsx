import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <AppProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;

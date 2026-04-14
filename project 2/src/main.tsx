
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './app/contexts/AuthContext';
import { SchoolProvider } from './app/contexts/SchoolContext';

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light">
    <AuthProvider>
      <SchoolProvider>
        <App />
      </SchoolProvider>
    </AuthProvider>
  </ThemeProvider>
);
  
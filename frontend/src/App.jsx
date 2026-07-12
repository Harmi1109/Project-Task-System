import { Routes, Route } from "react-router-dom";
import ProtectedLayout from "./components/ProtectedLayout.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Teams from "./pages/Teams.jsx";
import Documents from "./pages/Documents.jsx";
import Reports from "./pages/Reports.jsx";
import Chatbot from "./components/AIChatbot.jsx"; // Cleared name string to match your file file precisely

export default function App() {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#fdfbf7,#f9f5eb)] text-[var(--color-ink)] font-body antialiased selection:bg-[var(--color-pine)] selection:text-[var(--color-paper-raised)] relative">
      <Routes>
        {/* Public Routes */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        {/* Private Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>

      {/* 🤖 MOUNTED HERE SO IT FLOATS GLOBALLY EVERYWHERE */}
      <Chatbot />
    </div>
  );
}
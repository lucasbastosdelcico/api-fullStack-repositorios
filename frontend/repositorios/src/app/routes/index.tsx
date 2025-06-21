import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CadastroRepositorio, Dashboard } from "../pages";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastro-repositorio" element={<CadastroRepositorio />} />
        <Route path="/repositorios" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/repositorios" replace />} />
        <Route path="/cadastro-repositorio/:id" element={<CadastroRepositorio />} />
      </Routes>
    </BrowserRouter>
  );
};

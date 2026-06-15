import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { GameProvider } from "./context/GameContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Jogar from "./pages/Jogar";
import Loja from "./pages/Loja";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return () => unsub();
  }, []);

  if (carregando) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Carregando Jogo...
      </div>
    );
  }

  if (!usuario) {
    return (
      <div style={styles.authContainer}>
        <h1>🍌 Banana Clicker</h1>
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="*" element={<Login />} />
        </Routes>
        <button
          onClick={() =>
            navigate(
              window.location.pathname === "/cadastro" ? "/" : "/cadastro",
            )
          }
          style={styles.toggleButton}
        >
          {window.location.pathname === "/cadastro"
            ? "Já tem conta? Faça Login"
            : "Não tem conta? Cadastre-se"}
        </button>
      </div>
    );
  }

  return (
    <GameProvider>
      <div style={styles.app}>
        <Header />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Jogar />} />
            <Route path="/loja" element={<Loja />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </GameProvider>
  );
}

const styles = {
  app: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  },
  authContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  toggleButton: {
    marginTop: "20px",
    padding: "10px",
    cursor: "pointer",
    background: "transparent",
    border: "1px solid #222",
  },
};

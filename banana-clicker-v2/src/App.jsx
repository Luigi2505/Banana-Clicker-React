import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { GameProvider } from "./context/GameContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Jogar from "./pages/Jogar";
import Loja from "./pages/Loja";
import Ranking from "./pages/Ranking";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

export default function App() {
  const [usuario, setUsuario] = useState(undefined); // undefined = ainda carregando

  // Fica escutando se o usuário logou ou deslogou
  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, (user) => {
      setUsuario(user); // null = deslogado, objeto = logado
    });
    return () => cancelar();
  }, []);

  // Ainda verificando autenticação
  if (usuario === undefined) {
    return <p style={{ textAlign: "center", marginTop: 60 }}>Carregando...</p>;
  }

  // Usuário não logado — mostra só login e cadastro
  if (!usuario) {
    return (
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Usuário logado — mostra o jogo completo
  return (
    <GameProvider>
      <div style={styles.app}>
        <Header />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Jogar />} />
            <Route path="/loja" element={<Loja />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </GameProvider>
  );
}

const styles = {
  app: { minHeight: "100vh", display: "flex", flexDirection: "column" },
  main: { flex: 1 },
};

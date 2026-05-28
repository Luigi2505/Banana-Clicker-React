import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase'; // Ajuste o caminho se necessário

// Seus componentes originais
import { GameProvider } from "./context/GameContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Jogar from "./pages/Jogar";
import Loja from "./pages/Loja";
import Ranking from "./pages/Ranking";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

// Telas de Autenticação
import Cadastro from "./components/Cadastro";
import Login from "./components/Login";

export default function App() {
  // Estados para controlar o login
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  // Escuta as mudanças de login/logout no Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });

    return () => unsub();
  }, []);

  // Tela de carregamento enquanto o Firebase verifica o login
  if (carregando) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Carregando Jogo...</div>;
  }

  // PORTÃO FECHADO: Se não estiver logado, mostra apenas Login ou Cadastro
  if (!usuario) {
    return (
      <div style={styles.authContainer}>
        <h1>🍌 Banana Clicker</h1>
        
        {mostrarCadastro ? <Cadastro /> : <Login />}
        
        <button 
          onClick={() => setMostrarCadastro(!mostrarCadastro)}
          style={styles.toggleButton}
        >
          {mostrarCadastro ? "Já tem uma conta? Faça Login" : "Não tem conta? Cadastre-se"}
        </button>
      </div>
    );
  }

  // PORTÃO ABERTO: Sua estrutura original exata roda aqui dentro!
  return (
    <GameProvider>
      <div style={styles.app}>
        <Header />

        <main style={styles.main}>
          <Routes>
            <Route path="/"        element={<Jogar />} />
            <Route path="/loja"    element={<Loja />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </GameProvider>
  );
}

// Seus estilos, com algumas adições para a tela de login
const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
  },
  authContainer: {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  toggleButton: {
    marginTop: '20px', 
    background: 'none', 
    border: 'none', 
    color: 'blue', 
    cursor: 'pointer', 
    textDecoration: 'underline'
  }
};

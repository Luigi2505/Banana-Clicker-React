import { Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Jogar   from "./pages/Jogar";
import Loja    from "./pages/Loja";
import Ranking from "./pages/Ranking";

// App: envolve tudo com o GameProvider (estado global)
// e define as rotas da aplicação
export default function App() {
  return (
    <GameProvider>
      <div style={styles.app}>
        <Header />

        {/* Área de conteúdo: cada rota renderiza uma página diferente */}
        <main style={styles.main}>
          <Routes>
            <Route path="/"        element={<Jogar />}   />
            <Route path="/loja"    element={<Loja />}    />
            <Route path="/ranking" element={<Ranking />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </GameProvider>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
  },
};

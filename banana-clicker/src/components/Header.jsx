import { Link, useLocation } from "react-router-dom";
import { useGame } from "../context/GameContext";

// Componente de cabeçalho com navegação entre as páginas
export default function Header() {
  const { bananas } = useGame();
  const location = useLocation(); // para saber qual página está ativa

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#fff" : "#222",
    background: location.pathname === path ? "#222" : "transparent",
    padding: "6px 14px",
    border: "1px solid #222",
    fontFamily: "monospace",
    fontSize: 14,
  });

  return (
    <header style={styles.header}>
      <span style={styles.logo}>🍌 Banana Clicker</span>

      <nav style={styles.nav}>
        <Link to="/"         style={linkStyle("/")}>🐵 Jogar</Link>
        <Link to="/loja"     style={linkStyle("/loja")}>🛒 Loja</Link>
        <Link to="/ranking"  style={linkStyle("/ranking")}>🏆 Ranking</Link>
      </nav>

      <span style={styles.contador}>🍌 {Math.floor(bananas)}</span>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 24px",
    background: "#fff",
    borderBottom: "2px solid #222",
    flexWrap: "wrap",
    gap: 8,
  },
  logo: { fontWeight: "bold", fontSize: 18 },
  nav:  { display: "flex", gap: 8 },
  contador: { fontWeight: "bold", fontSize: 16 },
};
